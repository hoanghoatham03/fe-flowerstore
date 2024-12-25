export const loginSuccess = (data) => {
    return {
      type: "LOGIN_SUCCESS",
      payload: data,
    };
  };