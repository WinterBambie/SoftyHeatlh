import { useState, useEffect } from "react";

function usePasswordValidation(password) {
  const [rules, setRules] = useState([
    { test: false, msg: "Mínimo 8 caracteres" },
    { test: false, msg: "Al menos una mayúscula" },
    { test: false, msg: "Al menos un número" },
    { test: false, msg: "Al menos un carácter especial" },
  ]);

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const updated = [
      { test: password.length >= 8,                         msg: "Mínimo 8 caracteres" },
      { test: /[A-Z]/.test(password),                       msg: "Al menos una mayúscula" },
      { test: /[0-9]/.test(password),                       msg: "Al menos un número" },
      { test: /[!@#$%^&*(),.?":{}|<>_/+\-]/.test(password),     msg: "Al menos un carácter especial" },
    ];
    setRules(updated);
    setIsValid(updated.every(r => r.test));
  }, [password]); // se ejecuta cada vez que password cambia

  return { rules, isValid };
}

export default usePasswordValidation;