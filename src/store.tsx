import React from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import db from "./database";

// Define the question type
type Question = {
  id?: string;
  title: string;
  answer?: string;
};

// Define the initial state of the store
const initialState = {
  newQuestion: { id: "new" } as Question,
  questions: [] as Question[],
};

// Define the actions for the store
type Action =
  | { type: "ADD_QUESTION"; payload: Question }
  | { type: "REMOVE_QUESTION"; payload: Question }
  | { type: "UPDATE_QUESTION"; payload: Question }
  | { type: "UPDATE_NEW_QUESTION"; payload: Question };

// Define the reducer function for the store
const reducer = (state: typeof initialState, action: Action) => {
  const previewQuestions = [...state.questions];
  const index = previewQuestions.findIndex(
    (element) => element.id === action.payload.id
  );

  switch (action.type) {
    case "ADD_QUESTION":
      if (index === -1) {
        return {
          ...state,
          questions: [action.payload, ...previewQuestions],
        };
      } else {
        previewQuestions[index] = action.payload;

        return {
          ...state,
          questions: previewQuestions,
        };
      }

    case "REMOVE_QUESTION":
      return {
        ...state,
        newQuestion: { id: "new" } as Question,
        questions: state.questions.filter(
          (question) => question.id !== action.payload.id
        ),
      };

    case "UPDATE_QUESTION":
      if (index > -1) {
        previewQuestions[index] = action.payload;

        return {
          ...state,
          questions: previewQuestions,
        };
      }

    case "UPDATE_NEW_QUESTION":
      return {
        ...state,
        newQuestion: action.payload,
      };

    default:
      return state;
  }
};

// Create a context for the store
const StoreContext = React.createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create a custom hook to access the store
const useStore = () => {
  const context = React.useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
};

// Create a provider component for the store
const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = getAuth();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const filteredQuestions = query(
    collection(db, "questions"),
    where("answer", "!=", "Infelizmente não posso lhe ajudar com isso.")
  );

  React.useEffect(() => {
    signInAnonymously(auth).then(() => {
      return onSnapshot(filteredQuestions, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const doc = change.doc;
          const data = doc.data();

          if (change.type === "added") {
            dispatch({
              type: "ADD_QUESTION",
              payload: { id: doc.id, ...data } as Question,
            });
          }
          if (change.type === "modified") {
            dispatch({
              type: "UPDATE_QUESTION",
              payload: { id: doc.id, ...data } as Question,
            });
          }
          if (change.type === "removed") {
            dispatch({
              type: "REMOVE_QUESTION",
              payload: { id: doc.id, ...data } as Question,
            });
          }
        });
      });
    });
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export { type Question, StoreProvider, useStore };
