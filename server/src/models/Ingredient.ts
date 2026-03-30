import mongoose, { InferSchemaType, Model } from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      default: undefined,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: String,
      default: '',
    },
    addedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    versionKey: false,
  }
);

export type IngredientDocument = InferSchemaType<typeof ingredientSchema> & {
  _id: mongoose.Types.ObjectId;
};

const IngredientModel =
  (mongoose.models.Ingredient as Model<IngredientDocument>) ||
  mongoose.model<IngredientDocument>('Ingredient', ingredientSchema);

export default IngredientModel;
