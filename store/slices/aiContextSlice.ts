import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "./authSlice";
import { AIContext, RoleBasedPrompts, AIChatMessage } from "@/types";

interface AIContextState {
  context: AIContext;
  messages: AIChatMessage[];
  isTyping: boolean;
  roleConfig: RoleBasedPrompts | null;
}

const initialState: AIContextState = {
  context: {
    type: null,
    childId: undefined,
    childData: undefined,
    subjectId: undefined,
    subjectName: undefined,
  },
  messages: [],
  isTyping: false,
  roleConfig: null,
};

export const aiContextSlice = createSlice({
  name: "aiContext",
  initialState,
  reducers: {
    setContext: (state, action: PayloadAction<AIContext>) => {
      state.context = action.payload;
    },
    clearContext: (state) => {
      state.context = {
        type: null,
        childId: undefined,
        childData: undefined,
        subjectId: undefined,
        subjectName: undefined,
      };
    },
    setChildContext: (
      state,
      action: PayloadAction<{ childId: string; childData: any }>,
    ) => {
      state.context = {
        type: "child",
        childId: action.payload.childId,
        childData: action.payload.childData,
      };
    },
    setSubjectContext: (
      state,
      action: PayloadAction<{ subjectId: string; subjectName: string }>,
    ) => {
      state.context = {
        type: "subject",
        subjectId: action.payload.subjectId,
        subjectName: action.payload.subjectName,
      };
    },
    addMessage: (state, action: PayloadAction<AIChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setRoleConfig: (state, action: PayloadAction<RoleBasedPrompts>) => {
      state.roleConfig = action.payload;
    },
    initializeChat: (
      state,
      action: PayloadAction<{ role: UserRole; welcomeMessage: string }>,
    ) => {
      state.messages = [
        {
          id: "1",
          type: "ai",
          content: action.payload.welcomeMessage,
          timestamp: new Date().toISOString(),
        },
      ];
    },
  },
});

export const {
  setContext,
  clearContext,
  setChildContext,
  setSubjectContext,
  addMessage,
  clearMessages,
  setIsTyping,
  setRoleConfig,
  initializeChat,
} = aiContextSlice.actions;

export default aiContextSlice.reducer;
