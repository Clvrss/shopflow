'use strict';

const { models } = require('../src/models');

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets, peripherals and computing', sortOrder: 1 },
  { name: 'Audio', slug: 'audio', description: 'Headphones, speakers and microphones', parentSlug: 'electronics', sortOrder: 2 },
  { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Appliances and kitchen essentials', sortOrder: 3 },
  { name: 'Fitness', slug: 'fitness', description: 'Training gear and accessories', sortOrder: 4 },
  { name: 'Outdoor', slug: 'outdoor', description: 'Camping and hiking equipment', sortOrder: 5 },
  { name: 'Accessories', slug: 'accessories', description: 'Cases, chargers and everyday carry', sortOrder: 6 },
];

const PRODUCTS = [
  { sku: 'ELEC-1001', name: 'Wireless Mouse Pro', slug: 'wireless-mouse-pro', brand: 'Nimbus', priceCents: 2999, categorySlug: 'electronics', featured: true, description: 'Silent-click wireless mouse with 2.4GHz and Bluetooth, 1600 DPI.' },
  { sku: 'ELEC-1002', name: 'Mechanical Keyboard TKL', slug: 'mechanical-keyboard-tkl', brand: 'KeyForge', priceCents: 8999, categorySlug: 'electronics', featured: true, description: 'Tenkeyless hot-swappable mechanical keyboard with PBT keycaps.' },
  { sku: 'ELEC-1003', name: '27" 4K Monitor', slug: '27-4k-monitor', brand: 'Lumina', priceCents: 34999, categorySlug: 'electronics', featured: false, description: '27-inch IPS 4K display with USB-C charging, 95% DCI-P3.' },
  { sku: 'ELEC-1004', name: 'USB-C Hub 7-in-1', slug: 'usb-c-hub-7-in-1', brand: 'Nimbus', priceCents: 3999, categorySlug: 'electronics', featured: false, description: 'HDMI, SD, microSD, two USB-A and power delivery passthrough.' },
  { sku: 'ELEC-1005', name: 'Smart Webcam 1080p', slug: 'smart-webcam-1080p', brand: 'ClearView', priceCents: 7999, categorySlug: 'electronics', featured: false, description: '1080p/60 webcam with auto-framing and dual mics.' },
  { sku: 'ELEC-1006', name: 'Portable SSD 1TB', slug: 'portable-ssd-1tb', brand: 'VaultDrive', priceCents: 11999, categorySlug: 'electronics', featured: true, description: 'USB 3.2 Gen 2 portable drive, 1050MB/s read, shock resistant.' },
  { sku: 'AUD-2001', name: 'Over-Ear Headphones', slug: 'over-ear-headphones', brand: 'SoundPeak', priceCents: 15999, categorySlug: 'audio', featured: true, description: 'Studio-tuned over-ear headphones with ANC and 40h battery.' },
  { sku: 'AUD-2002', name: 'Bluetooth Speaker Mini', slug: 'bluetooth-speaker-mini', brand: 'BoomBox', priceCents: 4999, categorySlug: 'audio', featured: false, description: 'Pocket-sized waterproof speaker, 12h playtime.' },
  { sku: 'AUD-2003', name: 'Studio Condenser Mic', slug: 'studio-condenser-mic', brand: 'SoundPeak', priceCents: 12999, categorySlug: 'audio', featured: false, description: 'USB/XLR condenser microphone with cardioid pattern.' },
  { sku: 'AUD-2004', name: 'Wireless Earbuds', slug: 'wireless-earbuds', brand: 'BoomBox', priceCents: 8999, categorySlug: 'audio', featured: false, description: 'Active noise cancelling earbuds with wireless charging case.' },
  { sku: 'HOME-3001', name: 'Stainless Blender 1000W', slug: 'stainless-blender-1000w', brand: 'ChefMaster', priceCents: 8999, categorySlug: 'home-kitchen', featured: true, description: '1000W blender with stainless steel jar and 6 preset programs.' },
  { sku: 'HOME-3002', name: 'Drip Coffee Maker 12-Cup', slug: 'drip-coffee-maker-12-cup', brand: 'BrewBuddy', priceCents: 5999, categorySlug: 'home-kitchen', featured: false, description: 'Programmable 12-cup coffee maker with reusable filter.' },
  { sku: 'HOME-3003', name: 'Cast Iron Skillet 10"', slug: 'cast-iron-skillet-10', brand: 'ChefMaster', priceCents: 3499, categorySlug: 'home-kitchen', featured: false, description: 'Pre-seasoned cast iron skillet, oven safe to 500F.' },
  { sku: 'HOME-3004', name: 'Insulated Water Bottle 750ml', slug: 'insulated-water-bottle-750ml', brand: 'HydroCell', priceCents: 2499, categorySlug: 'home-kitchen', featured: false, description: 'Double-wall vacuum insulated bottle, keeps cold 24h.' },
  { sku: 'FIT-4001', name: 'Non-Slip Yoga Mat', slug: 'non-slip-yoga-mat', brand: 'ZenFlex', priceCents: 2999, categorySlug: 'fitness', featured: true, description: '6mm TPE yoga mat with alignment lines and carry strap.' },
  { sku: 'FIT-4002', name: 'Adjustable Dumbbell Set', slug: 'adjustable-dumbbell-set', brand: 'IronCore', priceCents: 24999, categorySlug: 'fitness', featured: false, description: 'Single pair adjusts 5-52.5 lbs, includes tray.' },
  { sku: 'FIT-4003', name: 'Resistance Bands Set', slug: 'resistance-bands-set', brand: 'FlexFit', priceCents: 1999, categorySlug: 'fitness', featured: false, description: 'Five color-coded resistance loops with carry bag.' },
  { sku: 'FIT-4004', name: 'Jump Rope Pro', slug: 'jump-rope-pro', brand: 'FlexFit', priceCents: 1499, categorySlug: 'fitness', featured: false, description: 'Ball-bearing speed rope with adjustable steel cable.' },
  { sku: 'OUT-5001', name: '2-Person Camping Tent', slug: '2-person-camping-tent', brand: 'WildCraft', priceCents: 12999, categorySlug: 'outdoor', featured: true, description: 'Freestanding 3-season tent, 4.5 lbs, 2 vestibules.' },
  { sku: 'OUT-5002', name: '60L Hiking Backpack', slug: '60l-hiking-backpack', brand: 'TrailHead', priceCents: 8999, categorySlug: 'outdoor', featured: false, description: 'Internal frame pack with ventilated back panel.' },
  { sku: 'OUT-5003', name: 'Camping Stove', slug: 'camping-stove', brand: 'WildCraft', priceCents: 4999, categorySlug: 'outdoor', featured: false, description: 'Two-burner propane stove with windscreen, 22,000 BTU.' },
  { sku: 'OUT-5004', name: 'Camping Hammock', slug: 'camping-hammock', brand: 'TrailHead', priceCents: 3999, categorySlug: 'outdoor', featured: false, description: 'Double hammock with straps, holds 400 lbs.' },
  { sku: 'ACC-6001', name: 'Silicone Phone Case', slug: 'silicone-phone-case', brand: 'CaseMate', priceCents: 1999, categorySlug: 'accessories', featured: false, description: 'Drop-protected silicone case with raised camera lip.' },
  { sku: 'ACC-6002', name: '65W GaN Charger', slug: '65w-gan-charger', brand: 'VoltEdge', priceCents: 2999, categorySlug: 'accessories', featured: false, description: '65W GaN wall charger, 2x USB-C + 1x USB-A.' },
  { sku: 'ACC-6003', name: 'Canvas Tote Bag', slug: 'canvas-tote-bag', brand: 'CaseMate', priceCents: 2499, categorySlug: 'accessories', featured: false, description: 'Heavyweight cotton canvas tote, 15L capacity.', isActive: false },
];

const VARIANTS = [
  { productSku: 'AUD-2001', sku: 'AUD-2001-BLK', name: 'Black', option1: 'Black', priceCents: 15999 },
  { productSku: 'AUD-2001', sku: 'AUD-2001-BLU', name: 'Midnight Blue', option1: 'Midnight Blue', priceCents: 15999 },
  { productSku: 'AUD-2004', sku: 'AUD-2004-WHT', name: 'White', option1: 'White', priceCents: 8999 },
  { productSku: 'AUD-2004', sku: 'AUD-2004-BLK', name: 'Black', option1: 'Black', priceCents: 8999 },
  { productSku: 'HOME-3004', sku: 'HOME-3004-CHR', name: 'Charcoal', option1: 'Charcoal', priceCents: 2499 },
  { productSku: 'HOME-3004', sku: 'HOME-3004-TEL', name: 'Teal', option1: 'Teal', priceCents: 2499 },
  { productSku: 'ACC-6001', sku: 'ACC-6001-CLR', name: 'Clear', option1: 'Clear', priceCents: 1999 },
  { productSku: 'ACC-6001', sku: 'ACC-6001-BLK', name: 'Black', option1: 'Black', priceCents: 1999 },
];

// sku -> stock quantity (variant skus override product stock)
const STOCK = {
  'ELEC-1001': 42,
  'ELEC-1002': 18,
  'ELEC-1003': 7,
  'ELEC-1004': 55,
  'ELEC-1005': 2,
  'ELEC-1006': 31,
  'AUD-2001-BLK': 12,
  'AUD-2001-BLU': 3,
  'AUD-2002': 0,
  'AUD-2003': 9,
  'AUD-2004-WHT': 25,
  'AUD-2004-BLK': 14,
  'HOME-3001': 16,
  'HOME-3002': 22,
  'HOME-3003': 38,
  'HOME-3004-CHR': 0,
  'HOME-3004-TEL': 11,
  'FIT-4001': 40,
  'FIT-4002': 4,
  'FIT-4003': 60,
  'FIT-4004': 33,
  'OUT-5001': 8,
  'OUT-5002': 5,
  'OUT-5003': 21,
  'OUT-5004': 29,
  'ACC-6001-CLR': 47,
  'ACC-6001-BLK': 0,
  'ACC-6002': 90,
  'ACC-6003': 0,
};

module.exports = {
  up: async () => {
    const categoryBySlug = {};
    for (const cat of CATEGORIES) {
      const parentId = cat.parentSlug ? categoryBySlug[cat.parentSlug].id : null;
      const created = await models.Category.create({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parentId,
        isActive: true,
        sortOrder: cat.sortOrder,
      });
      categoryBySlug[cat.slug] = created;
    }

    const productBySku = {};
    for (const p of PRODUCTS) {
      const created = await models.Product.create({
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceCents: p.priceCents,
        categoryId: categoryBySlug[p.categorySlug].id,
        brand: p.brand,
        isActive: p.isActive !== false,
        featured: p.featured === true,
      });
      productBySku[p.sku] = created;
    }

    const variantBySku = {};
    for (const v of VARIANTS) {
      const created = await models.ProductVariant.create({
        productId: productBySku[v.productSku].id,
        sku: v.sku,
        name: v.name,
        option1: v.option1,
        priceCents: v.priceCents,
        isActive: true,
      });
      variantBySku[v.sku] = created;
    }

    const inventoryRows = [];
    for (const [sku, quantity] of Object.entries(STOCK)) {
      if (variantBySku[sku]) {
        const variant = variantBySku[sku];
        inventoryRows.push({
          productId: variant.productId,
          variantId: variant.id,
          quantity,
          reservedQuantity: 0,
          lowStockThreshold: 5,
        });
      } else if (productBySku[sku]) {
        const product = productBySku[sku];
        inventoryRows.push({
          productId: product.id,
          variantId: null,
          quantity,
          reservedQuantity: 0,
          lowStockThreshold: 5,
        });
      }
    }
    await models.Inventory.bulkCreate(inventoryRows, { individualHooks: true });
  },

  down: async () => {
    await models.Inventory.destroy({ where: {}, force: true });
    await models.ProductVariant.destroy({ where: {}, force: true });
    await models.Product.destroy({ where: {}, force: true });
    await models.Category.destroy({ where: {}, force: true });
  },
};
