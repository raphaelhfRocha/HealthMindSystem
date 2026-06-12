import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext";
import { loginValidation, LoginFormData } from "../shared/validations/auth/login.validation";
import { parseApiError } from "../shared/components/ModalMessagesStatus/ModalMessagesStatus";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated } = useAuth();

  // Rota que o usuário tentou acessar antes de ser redirecionado ao login.
  // Caso não exista (acesso direto ao login), cai no /home.
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/home";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidation),
    defaultValues: { email: "", senha: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signIn(values.email, values.senha);
      navigate(from, { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      setError("root", { message: parsed.message });
    }
  });

  const inputStyle = {
    flex: 1, height: "38px", border: "none", borderRadius: "8px",
    background: "#D9D9D9", padding: "0 14px", fontSize: "14px", outline: "none", color: "#333",
  } as const;

  const errorTextStyle = {
    fontSize: "12px", color: "#b03a2e", fontWeight: 600, margin: "4px 0 0 64px",
  } as const;

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#e0e0e0",
    }}>
      {/* Left sidebar */}
      <div style={{
        width: "160px",
        minHeight: "100vh",
        background: "#1A4FA3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: "100px",
          color: "#7A8EBA",
          fontWeight: "bold",
          userSelect: "none",
          lineHeight: 1,
          fontFamily: "Georgia, serif",
        }}>Ψ</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "2.5rem 3rem",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Logo */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "2rem",
          }}>
            <img
              src="/Logo-Health-Mind.png"
              alt="Health Mind"
              style={{ height: "102px", width: "auto", maxWidth: "100%" }}
            />
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ fontSize: "15px", fontWeight: "500", color: "#333", minWidth: "38px" }}>Login</label>
                <input
                  type="email"
                  autoComplete="username"
                  placeholder="usuario@healthmind.com"
                  {...register("email")}
                  style={inputStyle}
                />
              </div>
              {errors.email && <p style={errorTextStyle}>{errors.email.message}</p>}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ fontSize: "15px", fontWeight: "500", color: "#333", minWidth: "38px" }}>Senha</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="senha"
                  {...register("senha")}
                  style={inputStyle}
                />
              </div>
              {errors.senha && <p style={errorTextStyle}>{errors.senha.message}</p>}
            </div>

            {errors.root && (
              <div style={{
                padding: "10px 14px", borderRadius: "10px", background: "#fff5f5",
                border: "1px solid #ffd0d0", color: "#b03a2e", fontSize: "13px", fontWeight: 600,
              }}>
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%", height: "42px", background: "#1A4FA3", color: "white",
                border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer", marginTop: "4px", transition: "opacity 0.2s",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
