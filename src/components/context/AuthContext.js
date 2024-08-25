import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { 
    signIn, 
    signUp, 
    confirmSignUp, 
    resendSignUpCode, 
    signOut, 
    resetPassword, 
    confirmResetPassword,
    getCurrentUser,
    fetchAuthSession,
    updateUserAttributes,
    confirmUserAttribute,
    signInWithRedirect
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import outputs from '../../amplifyconfiguration.json';

const AuthContext = createContext();

Amplify.configure(outputs);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authState, setAuthState] = useState('loading');

    useEffect(() => {
        checkUser();
        setAuthListener();
    }, []);

    async function checkUser() {
        try {
            const currentUser = await getCurrentUser();
            const session = await fetchAuthSession();
            setUser(currentUser);
            setAuthState('signedIn');
        } catch (error) {
            setUser(null);
            setAuthState('signedOut');
        }
    }

    function setAuthListener() {
        Hub.listen('auth', (data) => {
            switch (data.payload.event) {
                case 'signedIn':
                    checkUser();
                    break;
                case 'signedOut':
                    setUser(null);
                    setAuthState('signedOut');
                    break;
                case 'customOAuthState':
                    console.log('customOAuthState', data.payload.data);
                    break;
                default:
                    break;
            }
        });
    }

    async function handleSignIn(username, password) {
        try {
            const { isSignedIn, nextStep } = await signIn({ username, password });
            if (isSignedIn) {
                await checkUser();
            }
            return { isSignedIn, nextStep };
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    }

    async function handleSignUp(username, password, email) {
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email
                    }
                }
            });
            return { isSignUpComplete, userId, nextStep };
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    }

    async function handleConfirmSignUp(username, code) {
        try {
            const { isSignUpComplete } = await confirmSignUp({ username, confirmationCode: code });
            return isSignUpComplete;
        } catch (error) {
            console.error('Error confirming sign up:', error);
            throw error;
        }
    }

    async function handleResendConfirmationCode(username) {
        try {
            await resendSignUpCode({ username });
        } catch (error) {
            console.error('Error resending confirmation code:', error);
            throw error;
        }
    }

    async function handleSignOut() {
        try {
            await signOut();
            setUser(null);
            setAuthState('signedOut');
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    async function handleResetPassword(username) {
        try {
            const { nextStep } = await resetPassword({ username });
            return nextStep;
        } catch (error) {
            console.error('Error initiating password reset:', error);
            throw error;
        }
    }

    async function handleConfirmResetPassword(username, newPassword, confirmationCode) {
        try {
            await confirmResetPassword({ username, newPassword, confirmationCode });
        } catch (error) {
            console.error('Error confirming password reset:', error);
            throw error;
        }
    }

    async function handleUpdateUserAttributes(attributes) {
        try {
            const result = await updateUserAttributes({ userAttributes: attributes });
            return result;
        } catch (error) {
            console.error('Error updating user attributes:', error);
            throw error;
        }
    }

    async function handleConfirmUserAttribute(attributeKey, confirmationCode) {
        try {
            await confirmUserAttribute({ attributeKey, confirmationCode });
        } catch (error) {
            console.error('Error confirming user attribute:', error);
            throw error;
        }
    }

    async function handleSocialSignIn(provider) {
        try {
            await signInWithRedirect({ provider });
        } catch (error) {
            console.error(`Error signing in with ${provider}:`, error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            authState,
            signIn: handleSignIn,
            signUp: handleSignUp,
            confirmSignUp: handleConfirmSignUp,
            resendConfirmationCode: handleResendConfirmationCode,
            signOut: handleSignOut,
            resetPassword: handleResetPassword,
            confirmResetPassword: handleConfirmResetPassword,
            updateUserAttributes: handleUpdateUserAttributes,
            confirmUserAttribute: handleConfirmUserAttribute,
            socialSignIn: handleSocialSignIn
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);