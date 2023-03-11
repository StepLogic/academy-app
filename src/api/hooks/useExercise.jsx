import React from "react";
import useAuth from "@hooks/useMyContext";
const useExercise = (id) => {
  const { exercises } = useAuth();
  const [exercise, setExercise] = React.useState();

  React.useEffect(() => {
    if (id === undefined || id === null || !exercises) return;

    const ex = exercises?.toDo?.find((exercise) => exercise?.token === id);

    setExercise(ex);
  }, [id]);

  return { exercise };
};

export default useExercise;
