import { authRepository } from "@/features/authentication/repositories/auth.repository";
import { userRecordsRepository } from "@/features/authentication/repositories/user-records.repository";
import {
  AUTH_MESSAGES,
  AUTH_VALIDATION,
} from "@/features/authentication/constants/auth.constants";
import type {
  AuthResult,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  UpdatePasswordInput,
} from "@/features/authentication/types/auth.types";

function validatePassword(password: string): string | null {
  if (password.length < AUTH_VALIDATION.minPasswordLength) {
    return AUTH_MESSAGES.passwordTooShort;
  }

  return null;
}

function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) {
    return AUTH_MESSAGES.passwordMismatch;
  }

  return null;
}

class AuthService {
  async signIn(input: SignInInput): Promise<AuthResult> {
    const { error } = await authRepository.signInWithPassword(
      input.email,
      input.password,
    );

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      await userRecordsRepository.ensureForCurrentUser();
    } catch (caught) {
      return {
        success: false,
        error:
          caught instanceof Error
            ? caught.message
            : "Unable to initialize your account.",
      };
    }

    return { success: true };
  }

  async signUp(input: SignUpInput): Promise<AuthResult> {
    const passwordError = validatePassword(input.password);
    if (passwordError) {
      return { success: false, error: passwordError };
    }

    const matchError = validatePasswordMatch(
      input.password,
      input.confirmPassword,
    );
    if (matchError) {
      return { success: false, error: matchError };
    }

    const { data, error } = await authRepository.signUp(
      input.email,
      input.password,
      input.displayName,
    );

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user && !data.session) {
      return {
        success: true,
        requiresEmailConfirmation: true,
        message: AUTH_MESSAGES.emailConfirmation,
      };
    }

    if (data.session) {
      try {
        await userRecordsRepository.ensureForCurrentUser();
      } catch (caught) {
        return {
          success: false,
          error:
            caught instanceof Error
              ? caught.message
              : "Unable to initialize your account.",
        };
      }
    }

    return { success: true };
  }

  async signOut(): Promise<AuthResult> {
    const { error } = await authRepository.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  async requestPasswordReset(input: ResetPasswordInput): Promise<AuthResult> {
    const { error } = await authRepository.resetPasswordForEmail(input.email);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: AUTH_MESSAGES.resetLinkSent,
    };
  }

  async updatePassword(input: UpdatePasswordInput): Promise<AuthResult> {
    const passwordError = validatePassword(input.password);
    if (passwordError) {
      return { success: false, error: passwordError };
    }

    const matchError = validatePasswordMatch(
      input.password,
      input.confirmPassword,
    );
    if (matchError) {
      return { success: false, error: matchError };
    }

    const { error } = await authRepository.updatePassword(input.password);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: AUTH_MESSAGES.passwordUpdated,
    };
  }
}

export const authService = new AuthService();
