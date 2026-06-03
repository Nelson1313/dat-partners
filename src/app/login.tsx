import {
    useState,
} from "react";

import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    router,
} from "expo-router";

import {
    useAuthStore,
} from "../store/authStore";

import {
    supabase,
} from "../../src/lib/supabase";

export default function Login() {
    const [email, setEmail] =
        useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const {
        checkSession,
    } =
        useAuthStore();

    const handleLogin =
        async () => {
            try {
                setLoading(true);

                const {
                    data,
                    error,
                } =
                    await supabase.auth.signInWithPassword(
                        {
                            email:
                                email.trim(),

                            password,
                        }
                    );

                if (error) {
                    Alert.alert(
                        "Hiba",
                        error.message
                    );

                    return;
                }

                const {
                    data:
                    sessionData,
                } =
                    await supabase.auth.getSession();

                if (
                    sessionData.session
                ) {
                    // auth store refresh
                    await checkSession();

                    router.replace(
                        "/"
                    );
                } else {
                    Alert.alert(
                        "Hiba",
                        "Session nem jött létre."
                    );
                }
            } catch (
            err
            ) {
                console.error(
                    err
                );

                Alert.alert(
                    "Hiba",
                    "Bejelentkezési hiba"
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <View
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.card
                }
            >
                <View
                    style={
                        styles.logoContainer
                    }
                >
                    <Image
                        source={require(
                            "../../assets/dat-logo.png"
                        )}
                        style={
                            styles.logoImage
                        }
                        resizeMode="contain"
                    />
                </View>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={
                        setEmail
                    }
                    style={
                        styles.input
                    }
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Jelszó"
                    value={password}
                    onChangeText={
                        setPassword
                    }
                    secureTextEntry
                    style={
                        styles.input
                    }
                />

                <TouchableOpacity
                    style={
                        styles.button
                    }
                    onPress={
                        handleLogin
                    }
                    disabled={
                        loading
                    }
                >
                    <Text
                        style={
                            styles.buttonText
                        }
                    >
                        {loading
                            ? "Belépés..."
                            : "Bejelentkezés"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent:
                "center",
            alignItems:
                "center",

            backgroundColor:
                "#F6F8FB",

            padding: 24,
        },

        card: {
            width: 420,
            backgroundColor:
                "#fff",

            borderRadius: 34,

            padding: 28,

            borderWidth: 1,
            borderColor:
                "#E7EEF6",

            shadowColor:
                "#000",

            shadowOpacity:
                0.08,

            shadowRadius: 30,

            shadowOffset: {
                width: 0,
                height: 10,
            },
        },

        input: {
            height: 58,

            borderWidth: 1,
            borderColor:
                "#E5EAF0",

            borderRadius: 18,

            paddingHorizontal: 18,

            backgroundColor:
                "#FAFCFE",

            marginBottom: 14,

            fontSize: 16,
        },

        button: {
            backgroundColor:
                "#009DDF",

            height: 58,

            borderRadius: 18,

            justifyContent:
                "center",

            alignItems:
                "center",

            marginTop: 8,
        },

        buttonText: {
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
        },

        logoContainer: {
            alignItems:
                "center",

            marginBottom: 28,
        },

        logoImage: {
            width: 260,
            height: 80,
        },
    });