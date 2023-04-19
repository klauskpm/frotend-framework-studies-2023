export interface LoginPageProps {
  onSubmit: (formData: any, event: any) => void;
}

const extractFormData = () => {
  const form = document.getElementById("loginForm") as HTMLFormElement;
  if (!form) return {};
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  return data;
};

export default function LoginPage({ onSubmit }: LoginPageProps) {
  const handleSubmit = (event: any) => {
    event.preventDefault();
    onSubmit(extractFormData(), event);
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Type your email address and we'll send you a magic link.
          </p>
        </div>
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  name="email"
                  type="text"
                  placeholder="email"
                  className="input-bordered input"
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn-primary btn">Login with magic link</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
