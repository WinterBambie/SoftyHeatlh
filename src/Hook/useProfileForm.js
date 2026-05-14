import { useState, useCallback } from "react";

/**
 * useProfileForm
 * Hook compartido por DoctorProfile y PatientProfile.
 * Centraliza: tab activa, mensajes alert, loading y form de contraseña.
 */
export function useProfileForm(initialTab = "info") {
  const [tab,     setTab]     = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const clearMsgs   = useCallback(() => { setError(""); setSuccess(""); }, []);
  const showSuccess  = useCallback((msg) => { setSuccess(msg); setError(""); }, []);
  const showError    = useCallback((msg) => { setError(msg); setSuccess(""); }, []);

  const changeTab = useCallback((newTab) => {
    setTab(newTab);
    clearMsgs();
  }, [clearMsgs]);

  const [pwdForm, setPwdForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handlePwd = useCallback(
    (e) => setPwdForm((f) => ({ ...f, [e.target.name]: e.target.value })),
    []
  );

  const resetPwdForm = useCallback(() => {
    setPwdForm({ current_password: "", new_password: "", confirm_password: "" });
  }, []);

  /**
   * Validación del formulario de contraseña.
   * Retorna string con error o null si es válido.
   */
  const validatePwd = useCallback(() => {
    if (!pwdForm.current_password || !pwdForm.new_password || !pwdForm.confirm_password)
      return "Completa todos los campos.";
    if (pwdForm.new_password !== pwdForm.confirm_password)
      return "Las contraseñas nuevas no coinciden.";
    if (pwdForm.new_password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    return null;
  }, [pwdForm]);

  return {
    tab, changeTab,
    loading, setLoading,
    error, success,
    clearMsgs, showSuccess, showError,
    pwdForm, handlePwd, resetPwdForm, validatePwd,
  };
}