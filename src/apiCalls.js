import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`${baseUrl}/api/auth/login`, userCredential);
    console.log(res.data);

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
