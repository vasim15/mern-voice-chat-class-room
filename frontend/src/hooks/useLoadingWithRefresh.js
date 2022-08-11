import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

const useLoadingWithRefresh = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          {
            withCredentials: true,
          }
        );
        dispatch(setAuth(data));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    })();
  }, []);

  return { loading };
};

export default useLoadingWithRefresh;
