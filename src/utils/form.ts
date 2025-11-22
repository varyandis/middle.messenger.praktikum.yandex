type LoginFormValues = {
  login: string;
  password: string;
};

export function getLoginFormValues(form: HTMLFormElement): LoginFormValues {
  const formData = new FormData(form);
  const raw = Object.fromEntries(formData.entries());

  return {
    login: String(raw.login),
    password: String(raw.password),
  };
}
