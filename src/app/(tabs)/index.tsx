import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";


import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";

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


  const countyScrollRef =
    useRef<any>(null);

  const isDraggingRef =
    useRef(false);

  const startXRef =
    useRef(0);

  const scrollLeftRef =
    useRef(0);

  const [search, setSearch] =
    useState("");

  const closePartnerModal =
    () => {
      setShowPartnerModal(
        false
      );

      fetchPartners();

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

        setPartnerTaxNumber(
          ""
        );

        setPartnerCustomerId(
          ""
        );

        setPartnerContact(
          ""
        );

        setPartnerCounty(
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
    partnerTaxNumber,
    setPartnerTaxNumber,
  ] =
    useState("");

  const [
    partnerCustomerId,
    setPartnerCustomerId,
  ] =
    useState("");

  const [
    partnerContact,
    setPartnerContact,
  ] =
    useState("");

  const [
    partnerCounty,
    setPartnerCounty,
  ] =
    useState("");

  const [
    selectedType,
    setSelectedType,
  ] = useState<
    string | null
  >(null);

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
    partnerTypes,
    setPartnerTypes,
  ] = useState<string[]>([
    "Független",
  ]);

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
    partnerEmail.trim().length >= 5;

  const phoneValid =
    partnerPhone.replace(/\D/g, "").length >= 9;

  const [
    selectedCounty,
    setSelectedCounty,
  ] =
    useState<
      string | null
    >(null);

  const canSavePartner =
    partnerName.trim() !==
    "" &&
    partnerAddress.trim() !==
    "" &&
    phoneValid &&
    emailValid;

  const getPrimaryPartnerType = (types: string[]) => {
    if (types.includes("Roncsbörze")) {
      return "Roncsbörze";
    }

    if (types.includes("Javítói börze")) {
      return "Javítói börze";
    }

    if (types.includes("Értékelő")) {
      return "Értékelő";
    }

    if (types.includes("Márkaszervíz")) {
      return "Márkaszervíz";
    }

    return "Független";
  };

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

              partner_types:
                partnerTypes,

              partner_type: getPrimaryPartnerType(partnerTypes),

              tax_number:
                partnerTaxNumber,

              customer_id:
                partnerCustomerId,

              contact:
                partnerContact,

              county:
                partnerCounty,
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

              partner_types:
                partnerTypes,

              partner_type: getPrimaryPartnerType(partnerTypes),

              tax_number:
                partnerTaxNumber,

              customer_id:
                partnerCustomerId,

              contact:
                partnerContact,

              county:
                partnerCounty,
            };

        console.log(
          "SAVE BODY:",
          body
        );

        console.log(
          "ENDPOINT:",
          endpoint
        );

        console.log(
          "URL:",
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/${endpoint}`
        );

        const response =
          await fetch(
            `https://nseopolqejpjftjutckn.supabase.co/functions/v1/${endpoint}`,
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

        const result =
          await response.json();

        console.log(
          "FUNCTION RESULT:",
          result
        );

        console.log(
          "STATUS:",
          response.status
        );

        if (!response.ok) {
          console.error("FULL RESULT:", result);

          throw new Error(
            JSON.stringify(result, null, 2)
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
        console.error("SAVE ERROR:", error);

        alert(
          error instanceof Error
            ? error.message
            : JSON.stringify(error)
        );

        alert(
          "Nem sikerült menteni a javítót."
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
          "Biztos törölni szeretnéd ezt a javítót?"
        );

      if (
        !confirmed
      )
        return;



      try {
        const response =
          await fetch(
            "https://nseopolqejpjftjutckn.supabase.co/functions/v1/delete-partner",
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

  const counties =
    [
      ...new Set(
        partners
          .map(
            (p) =>
              p.county
          )
          .filter(
            (
              county
            ): county is string =>
              !!county
          )
      ),
    ].sort();

  const filteredPartners =
    partners.filter(
      (partner) => {

        const matchesType =
          selectedType
            ? partner.partner_types?.includes(selectedType)
            : true;

        const matchesCounty =
          selectedCounty
            ? partner.county ===
            selectedCounty
            : true;

        const query =
          search.toLowerCase();

        const matchesSearch =
          partner.name
            ?.toLowerCase()
            .includes(
              query
            ) ||

          partner.address
            ?.toLowerCase()
            .includes(
              query
            ) ||

          partner.email
            ?.toLowerCase()
            .includes(
              query
            ) ||

          partner.phone
            ?.toLowerCase()
            .includes(
              query
            );

        return (
          matchesType &&
          matchesCounty &&
          matchesSearch
        );
      }
    );

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
                "../../../assets/dat-logo.png"
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
          {
            filteredPartners.length
          }{" "}
          javító
        </Text>

        <View
          style={
            styles.searchContainer
          }
        >
          <Text
            style={
              styles.searchIcon
            }
          >
            🔍
          </Text>

          <TextInput
            placeholder="Keresés javítóra..."
            placeholderTextColor="#6F86B7"
            value={search}
            onChangeText={
              setSearch
            }
            style={
              styles.searchInput
            }
          />

          {search.length >
            0 && (
              <TouchableOpacity
                onPress={() =>
                  setSearch("")
                }
              >
                <Text
                  style={
                    styles.clearText
                  }
                >
                  ✕
                </Text>
              </TouchableOpacity>
            )}
        </View>

        {/* header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Javítók
          </Text>
        </View>

        {/* partner list */}
        {/* partner list */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          {[...filteredPartners]
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

                  setPartnerTaxNumber(
                    partner.tax_number ||
                    ""
                  );

                  setPartnerCustomerId(
                    partner.customer_id ||
                    ""
                  );

                  setPartnerContact(
                    partner.contact ||
                    ""
                  );

                  setPartnerCounty(
                    partner.county ||
                    ""
                  );

                  setPartnerTypes(
                    partner.partner_types ??
                    (
                      partner.partner_type
                        ? [partner.partner_type]
                        : ["Független"]
                    )
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
                    ellipsizeMode="tail"
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
                Javítók
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

                            setPartnerTypes([
                              "Független",
                            ]);

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
                              Javító hozzáadása
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

        <View style={styles.filtersBar}>


          <div
            style={{
              width: "100%",
              cursor: "grab",
            }}
            onMouseDown={(e) => {
              isDraggingRef.current =
                true;

              startXRef.current =
                e.pageX;
            }}
            onMouseUp={() => {
              isDraggingRef.current =
                false;
            }}
            onMouseLeave={() => {
              isDraggingRef.current =
                false;
            }}
            onMouseMove={(e) => {
              if (
                !isDraggingRef.current
              )
                return;

              const walk =
                (startXRef.current -
                  e.pageX) * 1.8;

              countyScrollRef.current?.scrollTo({
                x:
                  scrollLeftRef.current +
                  walk,
                animated: false,
              });
            }}
          >
            <ScrollView
              ref={countyScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              style={
                Platform.OS === "web"
                  ? ({
                    cursor: "grab",
                    userSelect: "none",
                    WebkitUserSelect:
                      "none",
                  } as any)
                  : undefined
              }
              onScroll={(e) => {
                scrollLeftRef.current =
                  e.nativeEvent.contentOffset.x;
              }}
              contentContainerStyle={{
                gap: 10,
                paddingRight: 20,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setSelectedCounty(null)
                }
                style={[
                  styles.filterChip,
                  !selectedCounty &&
                  styles.activeChip,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    !selectedCounty &&
                    styles.activeChipText,
                  ]}
                >
                  Összes
                </Text>
              </TouchableOpacity>

              {counties.map((county) => (
                <TouchableOpacity
                  key={county}
                  onPress={() =>
                    setSelectedCounty(county)
                  }
                  style={[
                    styles.filterChip,
                    selectedCounty === county &&
                    styles.activeChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCounty === county &&
                      styles.activeChipText,
                    ]}
                  >
                    {county}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </div>

          <View style={styles.typeFilters}>
            {[
              "Független",
              "Márkaszervíz",
              "Értékelő",
              "Javítói börze",
              "Roncsbörze",
            ].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() =>
                  setSelectedType(
                    selectedType === type
                      ? null
                      : type
                  )
                }
                style={[
                  styles.legendItem,

                  type ===
                  "Független" && {
                    borderColor:
                      "#63D471",
                  },

                  type ===
                  "Márkaszervíz" && {
                    borderColor:
                      "#FFD400",
                  },

                  type ===
                  "Értékelő" && {
                    borderColor:
                      "#FF5C8A",
                  },

                  type === "Javítói börze" && {
                    borderColor: "#FF8A00",
                  },

                  type === "Roncsbörze" && {
                    borderColor: "#8B5CF6",
                  },

                  selectedType === type && {
                    backgroundColor:
                      type === "Független"
                        ? "#63D471"
                        : type === "Márkaszervíz"
                          ? "#FFD400"
                          : type === "Értékelő"
                            ? "#FF5C8A"
                            : type === "Javítói börze"
                              ? "#FF8A00"
                              : "#8B5CF6",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.legendText,
                    {
                      color:
                        type === "Független"
                          ? "#63D471"
                          : type === "Márkaszervíz"
                            ? "#FFD400"
                            : type === "Értékelő"
                              ? "#FF5C8A"
                              : type === "Javítói börze"
                                ? "#FF8A00"
                                : "#8B5CF6",
                    },

                    selectedType ===
                    type && {
                      color:
                        "#09142B",
                    },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
                filteredPartners
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
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
                      ? "Javító szerkesztése"
                      : "Új javító"}
                  </Text>

                  <Text
                    style={
                      styles.modalSubtitle
                    }
                  >
                    {editingPartner
                      ? "Javító adatok módosítása"
                      : "Javító hozzáadása automatikus geokódolással"}
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
                  placeholder="Javító neve"
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

                {partnerEmail !== "" &&
                  !emailValid && (
                    <Text
                      style={
                        styles.validationError
                      }
                    >
                      Legalább 5 karakter szükséges
                    </Text>
                  )}
              </View>

              <View style={styles.formGrid}>
                <View style={styles.formCol}>
                  {/* kapcsolattartó */}
                  <View style={styles.inputWrap}>
                    <View
                      {...(Platform.OS === "web"
                        ? {
                          title:
                            "Kapcsolattartó neve",
                        }
                        : {})}
                    >
                      <User
                        size={18}
                        color="#FFD400"
                      />
                    </View>

                    <TextInput
                      placeholder="Kapcsolattartó"
                      placeholderTextColor="#94A3B8"
                      style={styles.input}
                      value={partnerContact}
                      onChangeText={
                        setPartnerContact
                      }
                    />
                  </View>

                  {/* ügyfélszám */}
                  <View style={styles.inputWrap}>
                    <View
                      {...(Platform.OS === "web"
                        ? {
                          title:
                            "DAT ügyfélszám",
                        }
                        : {})}
                    >
                      <Building2
                        size={18}
                        color="#63D471"
                      />
                    </View>

                    <TextInput
                      placeholder="Ügyfélszám"
                      placeholderTextColor="#94A3B8"
                      style={styles.input}
                      value={partnerCustomerId}
                      onChangeText={
                        setPartnerCustomerId
                      }
                    />
                  </View>
                </View>

                <View style={styles.formCol}>
                  {/* adószám */}
                  <View style={styles.inputWrap}>
                    <View
                      {...(Platform.OS === "web"
                        ? {
                          title:
                            "Cég adószáma (pl. 12345678-2-41)",
                        }
                        : {})}
                    >
                      <Building2
                        size={18}
                        color="#FF5C8A"
                      />
                    </View>

                    <TextInput
                      placeholder="Adószám"
                      placeholderTextColor="#94A3B8"
                      style={styles.input}
                      value={partnerTaxNumber}
                      onChangeText={
                        setPartnerTaxNumber
                      }
                    />
                  </View>

                  {/* megye */}
                  <View style={styles.inputWrap}>
                    <View
                      {...(Platform.OS === "web"
                        ? {
                          title:
                            "Partner megyéje (pl. Pest)",
                        }
                        : {})}
                    >
                      <MapPin
                        size={18}
                        color="#009DDF"
                      />
                    </View>

                    <TextInput
                      placeholder="Megye"
                      placeholderTextColor="#94A3B8"
                      style={styles.input}
                      value={partnerCounty}
                      onChangeText={
                        setPartnerCounty
                      }
                    />
                  </View>
                </View>
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

              <Text
                style={
                  styles.inputLabel
                }
              >
                Javító típusa
              </Text>

              <View
                style={
                  styles.typeSelector
                }
              >
                {[
                  "Független",
                  "Márkaszervíz",
                  "Értékelő",
                  "Javítói börze",
                  "Roncsbörze",
                ].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      if (partnerTypes.includes(type)) {

                        if (partnerTypes.length === 1) return;

                        setPartnerTypes(
                          partnerTypes.filter(
                            (t) => t !== type
                          )
                        );

                      } else {

                        setPartnerTypes([
                          ...partnerTypes,
                          type,
                        ]);

                      }
                    }}
                    style={[
                      styles.typeButton,

                      partnerTypes.includes(type) &&
                      styles.typeButtonActive,

                      partnerTypes.includes(type) &&
                      type === "Független" && {
                        backgroundColor:
                          "rgba(99,212,113,0.18)",

                        borderColor:
                          "#63D471",

                        borderWidth: 3,
                      },
                      partnerTypes.includes(type) &&
                      type === "Javítói börze" && {
                        borderColor: "#FF8A00",
                        borderWidth: 3,
                      },

                      partnerTypes.includes(type) &&
                      type === "Roncsbörze" && {
                        borderColor: "#8B5CF6",
                        borderWidth: 3,
                      },

                      partnerTypes.includes(type) &&
                      type === "Márkaszervíz" && {
                        backgroundColor:
                          "rgba(255,212,0,0.18)",

                        borderColor:
                          "#FFD400",

                        borderWidth: 3,
                      },

                      partnerTypes.includes(type) &&
                      type === "Értékelő" && {
                        backgroundColor:
                          "rgba(255,92,138,0.18)",

                        borderColor:
                          "#FF5C8A",

                        borderWidth: 3,
                      },

                      type ===
                      "Független" && {
                        borderColor:
                          "#63D471",
                      },

                      type ===
                      "Márkaszervíz" && {
                        borderColor:
                          "#FFD400",
                      },

                      type ===
                      "Értékelő" && {
                        borderColor:
                          "#FF5C8A",
                      },

                      type === "Javítói börze" && {
                        borderColor: "#FF8A00",
                      },

                      type === "Roncsbörze" && {
                        borderColor: "#8B5CF6",
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        justifyContent:
                          "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={[
                            styles.typeDot,
                            {
                              backgroundColor:
                                type === "Független"
                                  ? "#63D471"
                                  : type === "Márkaszervíz"
                                    ? "#FFD400"
                                    : type === "Értékelő"
                                      ? "#FF5C8A"
                                      : type === "Javítói börze"
                                        ? "#FF8A00"
                                        : "#8B5CF6",
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.typeText,

                            partnerTypes.includes(type) &&
                            styles.typeTextActive,
                          ]}
                        >
                          {type}
                        </Text>
                      </View>

                      {partnerTypes.includes(type) && (
                        <Text
                          style={{
                            color:
                              type === "Független"
                                ? "#63D471"
                                : type === "Márkaszervíz"
                                  ? "#FFD400"
                                  : type === "Értékelő"
                                    ? "#FF5C8A"
                                    : type === "Javítói börze"
                                      ? "#FF8A00"
                                      : "#8B5CF6",

                            fontSize: 18,
                            fontWeight:
                              "900",
                          }}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

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
                    🗑 Javító törlése
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
                      : "Javító mentése"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
        "#071021",
    },

    sidebar: {
      width: 340,
      backgroundColor: "#09142B",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      borderRightWidth: 1,
      borderRightColor: "#16284E",

      display: "flex",
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
      color: "#8AA2D3",

      marginTop: 4,

      fontSize: 14,

      textAlign: "center",

      fontWeight: "600",
    },

    listHeader: {
      marginBottom: 12,
    },

    listTitle: {
      fontSize: 12,

      fontWeight: "800",

      color: "#FFD400",

      textTransform:
        "uppercase",

      letterSpacing: 1.2,
    },

    partnerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 24,
      marginBottom: 12,
      padding: 18,

      overflow: "hidden",
      backgroundColor: "#112043",

      borderWidth: 1,
      borderColor: "#203A6E",
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

      minWidth: 0,
    },

    partnerName: {
      fontSize: 15,

      fontWeight: "700",

      color: "#FFFFFF",

      lineHeight: 22,

      paddingRight: 12,
    },

    partnerCity: {
      color: "#AFC0E0",

      marginTop: 4,

      fontSize: 13,

      lineHeight: 20,

      paddingRight: 18,
    },

    arrow: {
      color: "#FFD400",

      fontSize: 20,

      fontWeight: "800",
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
        "#0B1633",

      borderRadius: 20,

      paddingHorizontal: 18,

      marginBottom: 14,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      borderWidth: 1,

      borderColor:
        "#203A6E",
      zIndex: 9999,
    },

    segmented: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    activeTab: {
      backgroundColor:
        "#FFD400",

      borderRadius: 12,

      paddingHorizontal: 18,

      paddingVertical: 8,
    },

    activeTabText: {
      color: "#09142B",
      fontWeight: "600",
    },

    tabText: {
      color: "#B9C8E6",
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
        "#081224",
      zIndex: 1,
    },

    partnerRowLight: {
      backgroundColor:
        "#112043",
    },

    partnerRowDark: {
      backgroundColor:
        "#0D1B3A",

      borderColor:
        "#203A6E",
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
        "#FFD400",

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
      color: "#09142B",
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
        "rgba(7,16,33,0.82)",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    modalCard: {
      width: 760,
      maxHeight: "88%",

      backgroundColor:
        "#071021",

      borderRadius: 34,

      borderWidth: 1,
      borderColor:
        "#1B3564",

      padding: 36,

      shadowOpacity: 0,
      elevation: 0,
    },

    modalTitle: {
      fontSize: 30,
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: -1.4,
    },

    input: {
      flex: 1,

      color: "#FFFFFF",

      fontSize: 16,
      fontWeight: "600",
    },

    saveButton: {
      flex: 1,
      height: 58,
      borderRadius: 18,

      backgroundColor:
        "#FFD400",

      justifyContent:
        "center",

      alignItems:
        "center",
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
      color: "#1B3564",
      fontWeight: "800",
      fontSize: 15,
    },

    cancelText: {
      fontWeight: "700",
      color: "#FFFFFF",
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
        "#102041",

      borderWidth: 1,

      borderColor:
        "#203A6E",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    inputWrap: {
      height: 64,

      borderRadius: 24,

      backgroundColor:
        "#102041",

      borderWidth: 1.5,

      borderColor:
        "#203A6E",

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        22,

      gap: 16,

      marginBottom: 16,
    },

    modalSubtitle: {
      color: "#7D91B8",
      fontSize: 15,
      marginTop: 6,
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

    modalIconWrap: {
      width: 72,
      height: 72,

      borderRadius: 28,

      backgroundColor:
        "#102041",

      justifyContent:
        "center",

      alignItems:
        "center",

      borderWidth: 1,
      borderColor:
        "#203A6E",
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

    validationError: {
      color: "#ef4444",

      fontSize: 13,

      marginTop: 6,

      marginBottom: 8,

      marginLeft: 4,

      fontWeight: "500",
    },

    legendCard: {
      marginTop: 20,

      backgroundColor:
        "#0B1633",

      borderRadius: 24,

      paddingVertical: 18,

      paddingHorizontal: 20,

      borderWidth: 1,

      gap: 8,

      width: "100%",

      borderColor:
        "#1A376B",
    },

    legendTitle: {
      color: "#FFD400",
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 12,
      letterSpacing: 1.2,
    },

    legendItem: {
      height: 42,
      borderRadius: 14,
      paddingHorizontal: 14,
      backgroundColor:
        "#112043",

      justifyContent:
        "center",

      borderWidth: 2,
    },

    legendItemActive: {
      transform: [
        {
          scale: 1.02,
        },
      ],
    },

    legendText: {
      fontWeight: "700",
      fontSize: 15,
    },

    pickerContainer: {
      borderWidth: 1,

      borderColor:
        "#223B73",

      backgroundColor:
        "#112043",

      borderRadius: 14,

      overflow:
        "hidden",

      marginBottom: 16,
    },

    picker: {
      color: "#FFFFFF",

      height: 54,
    },

    inputLabel: {
      color: "#FFFFFF",

      fontSize: 14,

      fontWeight: "600",

      marginBottom: 8,

      marginTop: 10,
    },

    typeSelector: {
      gap: 10,

      marginBottom: 20,
    },

    typeButton: {
      height: 56,

      borderRadius: 18,

      backgroundColor:
        "#102041",

      borderWidth: 2,

      justifyContent:
        "center",

      paddingHorizontal:
        18,

      marginBottom: 16,
      overflow: "hidden",
    },

    typeButtonActive: {
      backgroundColor:
        "#16284E",
    },

    typeDot: {
      width: 14,

      height: 14,

      borderRadius: 999,

      marginRight: 14,
    },

    typeText: {
      fontSize: 16,
      fontWeight: "800",
      color: "#FFFFFF",
    },

    typeTextActive: {
      fontWeight: "800",
      color: "#FFFFFF",
    },

    searchContainer: {
      height: 50,

      borderRadius: 18,

      backgroundColor:
        "#101F42",

      borderWidth: 1,

      borderColor:
        "#203A6E",

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        16,

      marginTop: 18,

      marginBottom: 18,
    },

    searchInput: {
      flex: 1,

      color: "#FFFFFF",

      fontSize: 14,

      fontWeight: "500",
    },

    searchIcon: {
      fontSize: 16,

      marginRight: 10,
    },

    clearText: {
      color: "#7A93C7",

      fontSize: 18,

      fontWeight: "700",
    },

    filterTitle: {
      color: "#FFD400",

      fontSize: 15,

      fontWeight: "800",

      marginBottom: 12,

      letterSpacing: 1,
    },

    filterRow: {
      marginBottom: 24,
    },


    chipsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 24,
    },

    filterChip: {
      height: 38,
      backgroundColor: "#0F1C37",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.08)",
      borderRadius: 12,
      paddingHorizontal: 14,
      justifyContent: "center",
      alignItems: "center",
    },

    activeChip: {
      backgroundColor:
        "#FFD400",

      borderColor:
        "#FFD400",
    },

    filterChipText: {
      color: "#AFC0E0",

      fontWeight:
        "600",

      fontSize:
        13,
    },

    activeChipText: {
      color: "#09142B",

      fontWeight:
        "700",
    },

    filtersBar: {
      backgroundColor: "#0B1633",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#203A6E",
      paddingVertical: 14,
      paddingHorizontal: 18,
      marginBottom: 14,

      gap: 14,
    },

    typeFilters: {
      flexDirection: "row",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 4,
    },

    countyScroller: {
      width: "100%",
    },

    formGrid: {
      flexDirection: "row",
      gap: 14,
      marginBottom: 6,
    },

    formCol: {
      flex: 1,
    },
  });