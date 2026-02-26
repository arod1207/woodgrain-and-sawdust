import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    if (!args.deviceId) return null;

    const cart = await ctx.db
      .query("cart")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .unique();

    return cart;
  },
});

export const addToCart = mutation({
  args: {
    deviceId: v.string(),
    productId: v.string(),
    name: v.string(),
    price: v.number(),
    image: v.string(),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const qty = args.quantity ?? 1;
    const cart = await ctx.db
      .query("cart")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .unique();

    if (cart) {
      const existingIndex = cart.items.findIndex(
        (item) => item.productId === args.productId
      );

      const updatedItems = [...cart.items];
      if (existingIndex >= 0) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + qty,
        };
      } else {
        updatedItems.push({
          productId: args.productId,
          name: args.name,
          price: args.price,
          quantity: qty,
          image: args.image,
        });
      }

      await ctx.db.patch(cart._id, {
        items: updatedItems,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("cart", {
        deviceId: args.deviceId,
        items: [
          {
            productId: args.productId,
            name: args.name,
            price: args.price,
            quantity: qty,
            image: args.image,
          },
        ],
        updatedAt: Date.now(),
      });
    }
  },
});

export const updateQuantity = mutation({
  args: {
    deviceId: v.string(),
    productId: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.quantity) || args.quantity < 0) {
      throw new Error("Quantity must be a non-negative integer");
    }

    const cart = await ctx.db
      .query("cart")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .unique();

    if (!cart) throw new Error("Cart not found");

    let updatedItems;
    if (args.quantity <= 0) {
      updatedItems = cart.items.filter(
        (item) => item.productId !== args.productId
      );
    } else {
      updatedItems = cart.items.map((item) =>
        item.productId === args.productId
          ? { ...item, quantity: args.quantity }
          : item
      );
    }

    if (updatedItems.length === 0) {
      await ctx.db.delete(cart._id);
    } else {
      await ctx.db.patch(cart._id, {
        items: updatedItems,
        updatedAt: Date.now(),
      });
    }
  },
});

export const removeFromCart = mutation({
  args: {
    deviceId: v.string(),
    productId: v.string(),
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("cart")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .unique();

    if (!cart) return;

    const updatedItems = cart.items.filter(
      (item) => item.productId !== args.productId
    );

    if (updatedItems.length === 0) {
      await ctx.db.delete(cart._id);
    } else {
      await ctx.db.patch(cart._id, {
        items: updatedItems,
        updatedAt: Date.now(),
      });
    }
  },
});

export const clearCart = mutation({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("cart")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .unique();

    if (cart) {
      await ctx.db.delete(cart._id);
    }
  },
});
