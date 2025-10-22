import { ApiErrorHandler } from "@/service/error-handler-exceptions";
import { useAuthStore } from "@/store/auth";
import type { LoginCredentials } from "@/types/auth.type";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const errorLogin = ref<string | null>(null);
  const loading = ref(false);
  const isAuthenticated = computed(() => authStore.isLoggedIn);
  const user = computed(() => authStore.currentUser);
  const isLoading = computed(() => authStore.isLoading);
  const error = computed(() => authStore.authError);

  const setLoading = (value: boolean) => {
    loading.value = value;
    if (value) clearError();
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await authStore.login(credentials);

      if (success) {
        router.push("/");
      }
      return success;
    } catch (err) {
      setLoading(false);
      errorLogin.value = error.value?.message || "";
    } finally {
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    authStore.logout();
    router.push("/login");
  };

  const hasRole = (role: string): boolean => {
    return authStore.hasRole(role);
  };

  const isAdmin = (): boolean => {
    return authStore.hasRole("ADMIN");
  };

  const clearError = (): void => {
    authStore.clearError();
  };

  return {
    isAuthenticated,
    user,
    loading,
    isLoading,
    error,
    errorLogin,
    login,
    logout,
    hasRole,
    isAdmin,
    clearError,
  };
}
