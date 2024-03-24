import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import * as Sentry from "@sentry/node";
import { router } from "./trpc";
import { createContext } from "./context";
import { TRPCError } from "@trpc/server";
import { getRecipes } from "./procedures/recipes/getRecipes";
import { searchRecipes } from "./procedures/recipes/searchRecipes";
import { getSimilarRecipes } from "./procedures/recipes/getSimilarRecipes";
import { sendAssistantMessage } from "./procedures/assistant/sendAssistantMessage";
import { getAssistantMessages } from "./procedures/assistant/getAssistantMessages";
import { getLabels } from "./procedures/labels/getLabels";
import { getAllVisibleLabels } from "./procedures/labels/getAllVisibleLabels";
import { getLabelsByUserId } from "./procedures/labels/getLabelsByUserId";
import { getLabelGroups } from "./procedures/labelGroups/getLabelGroups";
import { createLabelGroup } from "./procedures/labelGroups/createLabelGroup";
import { createLabel } from "./procedures/labels/createLabel";
import { deleteLabel } from "./procedures/labels/deleteLabel";
import { deleteLabelGroup } from "./procedures/labelGroups/deleteLabelGroup";
import { updateLabelGroup } from "./procedures/labelGroups/updateLabelGroup";
import { updateLabel } from "./procedures/labels/updateLabel";
import { createRecipe } from "./procedures/recipes/createRecipe";
import { updateRecipe } from "./procedures/recipes/updateRecipe";
import { getRecipe } from "./procedures/recipes/getRecipe";
import { deleteRecipe } from "./procedures/recipes/deleteRecipe";
import { getMe } from "./procedures/users/getMe";
import { updatePreferences } from "./procedures/users/updatePreferences";
import { getPreferences } from "./procedures/users/getPreferences";
import { getRecipeFromOCR } from "./procedures/ml/getRecipeFromOCR";
import { getRecipesByTitle } from "./procedures/recipes/getRecipesByTitle";
import { getUniqueRecipeTitle } from "./procedures/recipes/getUniqueRecipeTitle";
import { getRecipeFromPDF } from "./procedures/ml/getRecipeFromPDF";
import { getRecipeFromText } from "./procedures/ml/getRecipeFromText";
import { signInWithGoogle } from "./procedures/users/signInWithGoogle";

const appRouter = router({
  labelGroups: router({
    createLabelGroup,
    getLabelGroups,
    updateLabelGroup,
    deleteLabelGroup,
  }),
  labels: router({
    createLabel,
    getAllVisibleLabels,
    getLabels,
    getLabelsByUserId,
    updateLabel,
    deleteLabel,
  }),
  recipes: router({
    createRecipe,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipes,
    searchRecipes,
    getSimilarRecipes,
    getRecipesByTitle,
    getUniqueRecipeTitle,
  }),
  assistant: router({
    sendAssistantMessage,
    getAssistantMessages,
  }),
  users: router({
    getMe,
    updatePreferences,
    getPreferences,
    signInWithGoogle,
  }),
  ml: router({
    getRecipeFromOCR,
    getRecipeFromPDF,
    getRecipeFromText,
  }),

  // TODO: Legacy compat remove
  getRecipes,
  searchRecipes,
  getSimilarRecipes,
});

export const trpcExpressMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: (opts) => {
    const { error, type, path, input, ctx, req } = opts;

    const statusCode = getHTTPStatusCodeFromError(error);
    if (statusCode >= 500) {
      console.error(error, error.stack);

      const mainError =
        error instanceof TRPCError ? error.cause || error : error;

      Sentry.captureException(mainError, {
        extra: {
          statusCode,
          error,
          type,
          path,
          input,
          ctx,
          req,
        },
      });
    }
  },
});

export type AppRouter = typeof appRouter;
