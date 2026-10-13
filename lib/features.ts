/**
 * Set SHOP_ENABLED=false to switch off the crosses shop: hides the nav link and
 * homepage section, sends /shop to the homepage, and turns away new checkouts.
 * Stripe webhooks and the order confirmation page keep working so any payment
 * already in flight still completes.
 */
export const isShopEnabled = () => process.env.SHOP_ENABLED !== "false";
