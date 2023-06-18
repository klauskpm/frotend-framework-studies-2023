import {useState} from "react";
import {redirect, useNavigate} from "react-router-dom";

import {LoginPage} from "@shared/simple";

import {magicLoginUser} from "../auth";
import {supabase} from "../features/supabase/supabaseClient";
import {useSession} from "../SessionProvider";
import ToastAlert from "../components/ToastError";

function Login() {
  const [session] = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(formData: any) {
    setError("");
    setLoading(true);

    await magicLoginUser(formData.email)
        .then((response) => {
          setLoading(false);
          if (response?.error) {
            setError(response.error.message);
            return;
          }
          setSent(true);
        });
  }

  if (!!session?.user) {
    navigate("/");
    return null;
  }

  return (
    <>
        <LoginPage onSubmit={onSubmit} sent={sent} loading={loading} />
        <ToastAlert open={!!error} errorMessage={error} onClose={() => setError("")} />
    </>
  );
}

export const loginLoader = async () => {
  const session = await supabase.auth.getSession().then(({ data }) => {
    return data?.session;
  });

  if (!session?.user) {
    return null;
  }

  return redirect("/");
};

export default Login;
