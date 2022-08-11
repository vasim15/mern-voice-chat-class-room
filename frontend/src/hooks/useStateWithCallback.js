import { useCallback, useEffect, useState, useRef } from "react";

export const useStateWithCallback = (initState) => {
  const [state, setState] = useState(initState);
  const cbRef = useRef();

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb;
    setState((prev) => {
      return typeof newState === "function" ? newState(prev) : newState;
    });
  }, []);
  return [state, updateState];
};
