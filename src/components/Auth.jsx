import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { validatePassword, getPasswordStrengthColor, getPasswordRequirementText } from '../utils/passwordValidator';
import styles from './Auth.module.css';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState(null);

  useEffect(() => {
    if (isSignUp && password) {
      setPasswordValidation(validatePassword(password));
    } else {
      setPasswordValidation(null);
    }
  }, [password, isSignUp]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Good morning';
    if (hour < 18) return '🌤️ Good afternoon';
    return '🌙 Good evening';
  };

  const getFriendlyError = (errorMessage) => {
    if (errorMessage.includes('Invalid login credentials')) {
      return '❌ Invalid email or password. Please try again.';
    }
    if (errorMessage.includes('Email not confirmed')) {
      return '⚠️ Please check your email and confirm your account first.';
    }
    if (errorMessage.includes('User already registered')) {
      return '⚠️ This email is already registered. Try signing in instead.';
    }
    if (errorMessage.includes('Password should be at least')) {
      return '⚠️ Password does not meet security requirements.';
    }
    if (errorMessage.includes('Username')) {
      return '⚠️ Username is already taken. Please choose another one.';
    }
    return `❌ ${errorMessage}`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate username on signup
    if (isSignUp) {
      if (!username || username.trim().length < 3) {
        setError('⚠️ Username must be at least 3 characters long.');
        setLoading(false);
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError('⚠️ Username can only contain letters, numbers, and underscores.');
        setLoading(false);
        return;
      }

      const validation = validatePassword(password);
      if (!validation.isValid) {
        setError('⚠️ Password does not meet security requirements. Please use a stronger password.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim(),
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setSuccess('✅ Account created! Check your email to confirm. You\'ll be logged in automatically after confirmation.');
        setEmail('');
        setUsername('');
        setPassword('');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: {
            persistSession: stayLoggedIn,
          },
        });
        if (error) throw error;
        setSuccess(`✅ Welcome back! Logging you in...`);
      }
    } catch (error) {
      setError(getFriendlyError(error.message));
    } finally {
      setLoading(false);
    }
  };

  const requirementsList = getPasswordRequirementText();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Project Tracker</h1>
          <p className={styles.subtitle}>
            {isSignUp ? '✨ Create your account' : `${getGreeting()}! Welcome back`}
          </p>
        </div>

        <form onSubmit={handleAuth} className={styles.form}>
          {isSignUp && (
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                className={styles.input}
                autoComplete="username"
              />
              <span className={styles.hint}>
                3-20 characters, letters, numbers, and underscores only
              </span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={styles.input}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {!isSignUp && (
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={stayLoggedIn}
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Stay logged in</span>
              </label>
            </div>
          )}

          {isSignUp && passwordValidation && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthHeader}>
                <span className={styles.strengthLabel}>Password Strength:</span>
                <span
                  className={styles.strengthValue}
                  style={{ color: getPasswordStrengthColor(passwordValidation.strength) }}
                >
                  {passwordValidation.strength.toUpperCase()}
                </span>
              </div>
              <div
                className={styles.strengthBar}
                style={{
                  background: getPasswordStrengthColor(passwordValidation.strength),
                  width: passwordValidation.strength === 'strong' ? '100%' : passwordValidation.strength === 'medium' ? '66%' : '33%'
                }}
              />
              <div className={styles.requirements}>
                {requirementsList.map((req) => (
                  <div
                    key={req.key}
                    className={`${styles.requirement} ${
                      passwordValidation.requirements[req.key] ? styles.requirementMet : ''
                    }`}
                  >
                    <span className={styles.requirementIcon}>
                      {passwordValidation.requirements[req.key] ? '✓' : '○'}
                    </span>
                    <span className={styles.requirementText}>{req.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (isSignUp && passwordValidation && !passwordValidation.isValid)}
            className={styles.submitBtn}
          >
            {loading ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner}></span>
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </span>
            ) : (
              isSignUp ? 'Sign Up' : 'Sign In'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
              setPassword('');
              setUsername('');
            }}
            className={styles.switchBtn}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>

      <div className={styles.background} />
    </div>
  );
}
