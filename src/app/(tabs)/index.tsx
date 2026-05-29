import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  canEditPartners,
} from "../../utils/permissions";

import { useAuthStore } from "../../store/authStore";

import {
  Platform,
} from "react-native";

import {
  Building2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  User,
  UserPlus,
  X
} from "lucide-react";

import WebMap from "@/components/map/WebMap";
import { usePartnersStore } from "../../store/partnersStore";

let WebMapLeaflet:
  any = null;

if (
  Platform.OS ===
  "web" &&
  typeof window !==
  "undefined"
) {
  WebMapLeaflet =
    require(
      "@/components/map/WebMapLeaflet"
    ).default;
}

export default function MapScreen() {

  const closePartnerModal =
    () => {
      setShowPartnerModal(
        false
      );

      setTimeout(() => {
        setEditingPartner(
          null
        );

        setPartnerName(
          ""
        );

        setPartnerAddress(
          ""
        );

        setPartnerPhone(
          ""
        );

        setPartnerEmail(
          ""
        );
      }, 250);
    };


  const [
    selectedPartner,
    setSelectedPartner,
  ] = useState<any>(
    null
  );

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);

  const [
    editingPartner,
    setEditingPartner,
  ] = useState<any>(
    null
  );

  const [
    showPartnerModal,
    setShowPartnerModal,
  ] = useState(false);

  const [
    partnerName,
    setPartnerName,
  ] = useState("");

  const [
    partnerAddress,
    setPartnerAddress,
  ] = useState("");

  const [
    partnerPhone,
    setPartnerPhone,
  ] = useState("");

  const [
    partnerEmail,
    setPartnerEmail,
  ] = useState("");

  const {
    isLoggedIn,
    role,
    logout,
    checkSession,
  } =
    useAuthStore();

  const {
    partners,
    fetchPartners,
  } =
    usePartnersStore();

  useEffect(() => {
    checkSession();
    fetchPartners();
  }, []);

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      partnerEmail
    );

  const phoneValid =
    /^(\+36|06)?[\s-]?(20|30|31|50|70)[\s-]?\d{3}[\s-]?\d{4}$/.test(
      partnerPhone.replace(
        /\s/g,
        ""
      )
    );

  const canSavePartner =
    partnerName.trim() !==
    "" &&
    partnerAddress.trim() !==
    "" &&
    phoneValid &&
    emailValid;

  const handleSavePartner =
    async () => {
      try {
        const endpoint =
          editingPartner
            ? "update-partner"
            : "geocode-partner";

        const body =
          editingPartner
            ? {
              id:
                editingPartner.id,

              name:
                partnerName,

              address:
                partnerAddress,

              phone:
                partnerPhone,

              email:
                partnerEmail,
            }
            : {
              name:
                partnerName,

              address:
                partnerAddress,

              phone:
                partnerPhone,

              email:
                partnerEmail,
            };

        const response =
          await fetch(
            `https://nebgtkogsnvlvoveiaxv.supabase.co/functions/v1/${endpoint}`,
            {
              method:
                "POST",

              headers:
              {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  body
                ),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.error ||
            "Mentés sikertelen"
          );
        }

        // reset
        setPartnerName(
          ""
        );

        setPartnerAddress(
          ""
        );

        setPartnerPhone(
          ""
        );

        setPartnerEmail(
          ""
        );

        closePartnerModal();

        await fetchPartners();
      } catch (
      error
      ) {
        console.error(
          "SAVE ERROR:",
          error
        );

        alert(
          "Nem sikerült menteni a partnert."
        );
      }
    };

  const handleDeletePartner =
    async () => {
      if (
        !editingPartner
      )
        return;

      const confirmed =
        confirm(
          "Biztos törölni szeretnéd ezt a partnert?"
        );

      if (
        !confirmed
      )
        return;

      try {
        const response =
          await fetch(
            "https://nebgtkogsnvlvoveiaxv.supabase.co/functions/v1/delete-partner",
            {
              method:
                "POST",

              headers:
              {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  id:
                    editingPartner.id,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.error
          );
        }

        closePartnerModal();

        setSelectedPartner(
          null
        );

        await fetchPartners();
      } catch (
      error
      ) {
        console.error(
          error
        );

        alert(
          "Nem sikerült törölni."
        );
      }
    };

  return (
    <View style={styles.container}>
      {/* sidebar */}
      <View style={styles.sidebar}>
        {/* header */}
        <View style={styles.brandSection}>
          <View
            style={
              styles.logoContainer
            }
          >
            <Image
              source={require(
                "../../../assets/aviloo-dat-logo.png"
              )}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text
          style={
            styles.brandSubtitle
          }
        >
          {partners.length} partner
        </Text>

        {/* header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Partnerek
          </Text>
        </View>

        {/* partner list */}
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          {[...partners]
            .sort((a, b) => {
              const zipA = parseInt(
                a.address.match(/^\d+/)?.[0] || "0"
              );

              const zipB = parseInt(
                b.address.match(/^\d+/)?.[0] || "0"
              );

              return zipA - zipB;
            })
            .map((
              partner,
              index
            ) => (
              <TouchableOpacity
                key={partner.id}
                style={[
                  styles.partnerRow,
                  index % 2 === 0
                    ? styles.partnerRowLight
                    : styles.partnerRowDark,
                ]}
                activeOpacity={
                  0.85
                }
                onPress={() => {
                  console.log(
                    "CLICKED:",
                    partner.id
                  );



                  setSelectedPartner(
                    partner
                  );
                }}

                onLongPress={() => {
                  if (
                    !canEditPartners(
                      role
                    )
                  )
                    return;

                  setEditingPartner(
                    partner
                  );

                  setPartnerName(
                    partner.name
                  );

                  setPartnerAddress(
                    partner.address
                  );

                  setPartnerPhone(
                    partner.phone ||
                    ""
                  );

                  setPartnerEmail(
                    partner.email ||
                    ""
                  );

                  setShowPartnerModal(
                    true
                  );
                }}
              >
                <View
                  style={
                    styles.partnerDot
                  }
                />

                <View
                  style={
                    styles.partnerInfo
                  }
                >
                  <Text
                    style={
                      styles.partnerName
                    }
                    numberOfLines={1}
                  >
                    {partner.name}
                  </Text>

                  <Text
                    style={
                      styles.partnerCity
                    }
                    numberOfLines={1}
                  >
                    {partner.address}
                  </Text>
                </View>

                <Text
                  style={
                    styles.arrow
                  }
                >
                  →
                </Text>
              </TouchableOpacity>
            )
            )}
        </ScrollView>
      </View>

      {/* main */}
      <View style={styles.main}>
        {/* topbar */}
        <View style={styles.topbar}>
          <View style={styles.segmented}>
            {/* map */}
            <TouchableOpacity
              style={styles.activeTab}
              activeOpacity={0.85}
            >
              <Text
                style={
                  styles.activeTabText
                }
              >
                Térkép
              </Text>
            </TouchableOpacity>

            {/* list */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                router.push("/list")
              }
            >
              <Text
                style={styles.tabText}
              >
                Partnerek
              </Text>
            </TouchableOpacity>
          </View>

          {/* login */}
          {!isLoggedIn ? (
            <TouchableOpacity
              style={
                styles.loginButton
              }
              onPress={() =>
                router.push(
                  "/login"
                )
              }
            >
              <Text
                style={
                  styles.loginText
                }
              >
                Bejelentkezés
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                position:
                  "relative",
              }}
            >
              <TouchableOpacity
                style={
                  styles.profileButton
                }
                onPress={() =>
                  setShowProfileMenu(
                    !showProfileMenu
                  )
                }
              >
                <Text
                  style={
                    styles.profileText
                  }
                >
                  {role?.toUpperCase()} ▼
                </Text>
              </TouchableOpacity>

              {showProfileMenu && (
                <>
                  {/* kattintás kívül */}
                  <TouchableOpacity
                    activeOpacity={1}
                    style={
                      styles.menuOverlay
                    }
                    onPress={() =>
                      setShowProfileMenu(
                        false
                      )
                    }
                  />

                  <View
                    style={
                      styles.profileMenu
                    }
                  >
                    <TouchableOpacity
                      style={styles.menuItem}
                    >
                      <View style={styles.menuRow}>
                        <View style={styles.menuIcon}>
                          <User
                            size={20}
                            color="#111827"
                            strokeWidth={2.4}
                            style={{
                              marginLeft: -5,
                            }}
                          />
                        </View>

                        <Text style={styles.menuText}>
                          Profil
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {canEditPartners(
                      role
                    ) && (
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => {
                            setShowProfileMenu(
                              false
                            );

                            // reset edit mode
                            setEditingPartner(
                              null
                            );

                            // reset form
                            setPartnerName(
                              ""
                            );

                            setPartnerAddress(
                              ""
                            );

                            setPartnerPhone(
                              ""
                            );

                            setPartnerEmail(
                              ""
                            );

                            setShowPartnerModal(
                              true
                            );
                          }}
                        >
                          <View style={styles.menuRow}>
                            <View style={styles.menuIcon}>
                              <UserPlus
                                size={20}
                                color="#2563EB"
                                strokeWidth={2.2}
                              />
                            </View>

                            <Text
                              style={styles.menuText}
                              numberOfLines={1}
                            >
                              Partner hozzáadása
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={logout}
                    >
                      <View style={styles.menuRow}>
                        <View style={styles.menuIcon}>
                          <LogOut
                            size={20}
                            color="#EF4444"
                            strokeWidth={2.4}
                          />
                        </View>

                        <Text style={styles.logoutText}>
                          Kijelentkezés
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        </View>

        {/* map */}
        <View
          style={
            styles.mapContainer
          }
        >
          {Platform.OS ===
            "web" &&
            WebMapLeaflet ? (
            <WebMapLeaflet
              partners={
                partners
              }
              selectedPartner={
                selectedPartner
              }
            />
          ) : (
            <WebMap
              selectedPartner={
                selectedPartner
              }
            />
          )}
        </View>
      </View >
      <Modal
        visible={showPartnerModal}
        transparent
        animationType="fade"
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.modalCard
            }
          >
            {/* header */}
            <View
              style={
                styles.modalHeader
              }
            >
              <View
                style={
                  styles.modalIcon
                }
              >
                <PlusCircle
                  size={28}
                  color="#009DDF"
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  {editingPartner
                    ? "Partner szerkesztése"
                    : "Új partner"}
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  {editingPartner
                    ? "Partner adatok módosítása"
                    : "Partner hozzáadása automatikus geokódolással"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={
                  closePartnerModal
                }
                style={
                  styles.closeButton
                }
              >
                <X
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* name */}
            <View
              style={
                styles.inputWrap
              }
            >
              <Building2
                size={18}
                color="#009DDF"
              />

              <TextInput
                placeholder="Partner neve"
                placeholderTextColor="#94A3B8"
                style={
                  styles.input
                }
                value={partnerName}
                onChangeText={
                  setPartnerName
                }
              />
            </View>

            {/* address */}
            <View
              style={
                styles.inputWrap
              }
            >
              <MapPin
                size={18}
                color="#009DDF"
              />

              <TextInput
                placeholder="Cím"
                placeholderTextColor="#94A3B8"
                style={
                  styles.input
                }
                value={
                  partnerAddress
                }
                onChangeText={
                  setPartnerAddress
                }
              />
            </View>

            {/* phone */}
            <View
              style={
                styles.inputWrap
              }
            >
              <Phone
                size={18}
                color="#EC4899"
              />

              <TextInput
                placeholder="Telefonszám"
                placeholderTextColor="#94A3B8"
                style={
                  styles.input
                }
                value={
                  partnerPhone
                }
                onChangeText={
                  setPartnerPhone
                }
              />
            </View>

            {/* email */}
            <View
              style={
                styles.inputWrap
              }
            >
              <Mail
                size={18}
                color="#8B5CF6"
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#94A3B8"
                style={
                  styles.input
                }
                value={
                  partnerEmail
                }
                onChangeText={
                  setPartnerEmail
                }
              />

              {partnerEmail !==
                "" &&
                !emailValid && (
                  <Text
                    style={
                      styles.validationError
                    }
                  >
                    Hibás email formátum
                  </Text>
                )}
            </View>
            {!canSavePartner && (
              <Text
                style={{
                  color: "#94A3B8",
                  marginTop: 6,
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Minden mező kitöltése kötelező!
              </Text>
            )}

            {editingPartner && (
              <TouchableOpacity
                style={
                  styles.deleteButton
                }
                onPress={
                  handleDeletePartner
                }
              >
                <Text
                  style={
                    styles.deleteText
                  }
                >
                  🗑 Partner törlése
                </Text>
              </TouchableOpacity>
            )}

            {/* footer */}
            <View
              style={
                styles.modalFooter
              }
            >
              <TouchableOpacity
                style={
                  styles.cancelButton
                }
                onPress={
                  closePartnerModal
                }
              >
                <Text
                  style={
                    styles.cancelText
                  }
                >
                  Mégse
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !canSavePartner &&
                  styles.saveButtonDisabled,
                ]}
                disabled={
                  !canSavePartner
                }
                onPress={
                  handleSavePartner
                }
              >
                <Text
                  style={
                    styles.saveText
                  }
                >
                  {editingPartner
                    ? "Módosítás mentése"
                    : "Partner mentése"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      backgroundColor:
        "#F5F7FA",
    },

    sidebar: {
      width: 310,
      backgroundColor:
        "#FFFFFF",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      borderRightWidth: 1,
      borderRightColor:
        "#ECEFF3",
    },

    brandSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },

    brandDot: {
      width: 12,
      height: 12,
      borderRadius: 999,
      backgroundColor:
        "#009DDF",
      marginRight: 12,
    },

    brandTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111827",
    },

    brandSubtitle: {
      color: "#64748B",
      marginTop: 2,
      fontSize: 14,
    },

    listHeader: {
      marginBottom: 12,
    },

    listTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: "#94A3B8",
      textTransform:
        "uppercase",
      letterSpacing: 1,
    },

    partnerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginBottom: 12,

      backgroundColor:
        "#FFFFFF",

      borderWidth: 1.2,
      borderColor:
        "#E8EEF5",

      shadowColor:
        "#0F172A",
      shadowOpacity:
        0.04,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 2,
    },

    partnerDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor:
        "#009DDF",
      marginRight: 14,
    },

    partnerInfo: {
      flex: 1,
    },

    partnerName: {
      fontSize: 15,
      fontWeight: "600",
      color: "#111827",
    },

    partnerCity: {
      color: "#64748B",
      marginTop: 2,
      fontSize: 13,
    },

    arrow: {
      color: "#94A3B8",
      fontSize: 18,
      fontWeight: "600",
    },

    main: {
      flex: 1,
      padding: 14,
      minWidth: 0,
      overflow: "visible",
      zIndex: 10,
    },

    topbar: {
      height: 58,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 18,
      paddingHorizontal: 18,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      borderWidth: 1,
      borderColor: "#EEF2F6",
      zIndex: 9999,
    },

    segmented: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    activeTab: {
      backgroundColor:
        "#009DDF",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    activeTabText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },

    tabText: {
      color: "#64748B",
      fontWeight: "500",
    },

    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#F8FAFC",
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "#EEF2F6",
    },

    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor:
        "#22C55E",
      marginRight: 8,
    },

    liveText: {
      fontWeight: "600",
      color: "#111827",
    },

    mapContainer: {
      flex: 1,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor:
        "#EAF2F8",
      zIndex: 1,
    },

    partnerRowLight: {
      backgroundColor:
        "#FFFFFF",
    },

    partnerRowDark: {
      backgroundColor:
        "#F8FBFE",
      borderColor:
        "#DCE8F5",
    },
    logoContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent:
        "center",
      marginBottom: 8,
    },

    logo: {
      width: 250,
      height: 92,
    },

    loginButton: {
      backgroundColor:
        "#111827",

      paddingHorizontal:
        18,

      height: 42,

      borderRadius: 14,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    loginText: {
      color: "#FFF",
      fontWeight: "700",
      fontSize: 14,
    },

    profileButton: {
      backgroundColor:
        "#0F172A",

      height: 42,

      borderRadius: 14,

      paddingHorizontal:
        18,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    profileText: {
      color: "#FFF",
      fontWeight: "700",
      fontSize: 14,
    },

    profileMenu: {
      position:
        "absolute",

      top: 54,
      right: 0,

      width: 290,

      backgroundColor:
        "#FFFFFF",

      borderRadius: 20,

      borderWidth: 1,
      borderColor:
        "#E8EEF5",

      shadowColor:
        "#000",

      shadowOpacity:
        0.08,

      shadowRadius:
        18,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      overflow:
        "hidden",

      zIndex: 99999,
      elevation: 999,
    },

    menuItem: {
      height: 56,

      paddingHorizontal:
        20,

      justifyContent:
        "center",

      borderBottomWidth: 1,
      borderBottomColor:
        "#F1F5F9",
    },

    menuText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#111827",

      marginLeft: 14,

      flexShrink: 0,
    },

    logoutText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#EF4444",

      marginLeft: 14,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor:
        "rgba(15,23,42,0.55)",

      justifyContent:
        "center",

      alignItems:
        "center",

      backdropFilter:
        "blur(14px)",
    },

    modalCard: {
      width: 620,

      backgroundColor:
        "#FFFFFF",

      borderRadius: 34,

      padding: 28,

      borderWidth: 1,
      borderColor:
        "#EEF2F7",

      shadowColor:
        "#0F172A",

      shadowOpacity:
        0.14,

      shadowRadius:
        50,

      shadowOffset: {
        width: 0,
        height: 24,
      },
    },

    modalTitle: {
      fontSize: 26,
      fontWeight: "800",
      color: "#0F172A",
    },

    input: {
      flex: 1,
      height: "100%",
      marginLeft: 14,
      fontSize: 15,
      color: "#0F172A",
    },

    saveButton: {
      flex: 1,

      height: 58,

      borderRadius: 18,

      backgroundColor:
        "#009DDF",

      justifyContent:
        "center",

      alignItems:
        "center",

      shadowColor:
        "#009DDF",

      shadowOpacity:
        0.28,

      shadowRadius:
        24,

      shadowOffset: {
        width: 0,
        height: 12,
      },
    },

    menuRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 12,

    },

    menuIcon: {
      width: 28,
      alignItems: "center",
      justifyContent: "center",
    },

    saveText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 15,
    },

    cancelText: {
      fontWeight: "700",
      color: "#475569",
    },

    modalFooter: {
      flexDirection:
        "row",

      gap: 14,

      marginTop: 12,
    },

    cancelButton: {
      flex: 1,

      height: 58,

      borderRadius: 18,

      backgroundColor:
        "#F1F5F9",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    inputWrap: {
      height: 62,

      borderRadius: 18,

      backgroundColor:
        "#F8FAFC",

      borderWidth: 1,
      borderColor:
        "#E2E8F0",

      paddingHorizontal: 18,

      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom: 14,
    },

    modalSubtitle: {
      color: "#64748B",
      marginTop: 4,
      lineHeight: 20,
    },

    closeButton: {
      width: 44,
      height: 44,

      borderRadius: 999,

      backgroundColor:
        "#F8FAFC",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    modalIcon: {
      width: 64,
      height: 64,

      borderRadius: 22,

      backgroundColor:
        "#E0F2FE",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 18,
    },

    modalHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom: 28,
    },

    saveButtonDisabled: {
      backgroundColor:
        "#CBD5E1",

      shadowOpacity: 0,
    },

    menuOverlay: {
      position:
        "absolute",

      top: -1000,
      left: -1000,
      right: -1000,
      bottom: -1000,

      zIndex: 99998,
    },

    deleteButton: {
      height: 52,

      borderRadius: 18,

      backgroundColor:
        "#FEF2F2",

      borderWidth: 1,

      borderColor:
        "#FECACA",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginBottom: 14,
    },

    deleteText: {
      color: "#DC2626",

      fontWeight: "700",

      fontSize: 15,
    },
  });