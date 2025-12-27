export type QuestionMarkState = {
  favorite: boolean;
  known: boolean;
  unknown: boolean;
};

export type QuestionMarkField = keyof QuestionMarkState;

export const defaultQuestionMarkState: QuestionMarkState = {
  favorite: false,
  known: false,
  unknown: false,
};

export function getNextQuestionMarkState(
  current: QuestionMarkState,
  field: QuestionMarkField
): QuestionMarkState {
  if (field === "favorite") {
    return { ...current, favorite: !current.favorite };
  }

  if (field === "known") {
    const nextKnown = !current.known;
    return {
      ...current,
      known: nextKnown,
      unknown: nextKnown ? false : current.unknown,
    };
  }

  const nextUnknown = !current.unknown;

  return {
    ...current,
    unknown: nextUnknown,
    known: nextUnknown ? false : current.known,
  };
}
