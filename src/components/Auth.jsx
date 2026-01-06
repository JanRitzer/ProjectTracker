import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { validatePassword, getPasswordStrengthColor, getPasswordRequirementText } from '../utils/passwordValidator';
import styles from './Auth.module.css';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    return `❌ ${errorMessage}`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate password strength on signup
    if (isSignUp) {
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
        });
        if (error) throw error;
        setSuccess('✅ Account created! Check your email to confirm your account.');
        setEmail('');
        setPassword('');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccess('✅ Welcome back! Logging you in...');
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
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleAuth} className={styles.form}>
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
