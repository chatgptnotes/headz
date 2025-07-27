// Database seeding utility for the Headz application
import { supabase } from '../lib/supabase';
import { generateSampleHairstyles, sampleCategories } from './imageUtils';

// Seed categories
export const seedCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('hairstyle_categories')
      .upsert(sampleCategories, { onConflict: 'name' })
      .select();

    if (error) throw error;
    console.log('Categories seeded successfully:', data);
    return data;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

// Seed hairstyles
export const seedHairstyles = async () => {
  try {
    // First get categories to map them correctly
    const { data: categories } = await supabase
      .from('hairstyle_categories')
      .select('id, name');

    if (!categories) throw new Error('No categories found');

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {} as Record<string, string>);

    const sampleHairstyles = generateSampleHairstyles();
    
    // Map hairstyles to category IDs
    const hairstylesWithCategories = sampleHairstyles.map(style => ({
      ...style,
      category_id: categoryMap[style.category === 'mens' ? 'Men\'s Cuts' : 
                              style.category === 'womens' ? 'Women\'s Styles' : 
                              'Unisex Options']
    }));

    const { data, error } = await supabase
      .from('hairstyles')
      .upsert(hairstylesWithCategories, { onConflict: 'name' })
      .select();

    if (error) throw error;
    console.log('Hairstyles seeded successfully:', data);
    return data;
  } catch (error) {
    console.error('Error seeding hairstyles:', error);
    throw error;
  }
};

// Seed all data
export const seedAllData = async () => {
  try {
    console.log('Starting database seeding...');
    
    await seedCategories();
    await seedHairstyles();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};

// Clear all data (for testing)
export const clearAllData = async () => {
  try {
    console.log('Clearing all data...');
    
    const { error: hairstylesError } = await supabase
      .from('hairstyles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except dummy

    const { error: categoriesError } = await supabase
      .from('hairstyle_categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except dummy

    if (hairstylesError) throw hairstylesError;
    if (categoriesError) throw categoriesError;
    
    console.log('All data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// Check if data exists
export const checkDataExists = async () => {
  try {
    const { data: categories } = await supabase
      .from('hairstyle_categories')
      .select('count')
      .limit(1);

    const { data: hairstyles } = await supabase
      .from('hairstyles')
      .select('count')
      .limit(1);

    return {
      hasCategories: categories && categories.length > 0,
      hasHairstyles: hairstyles && hairstyles.length > 0
    };
  } catch (error) {
    console.error('Error checking data:', error);
    return { hasCategories: false, hasHairstyles: false };
  }
};

// Auto-seed if no data exists
export const autoSeedIfEmpty = async () => {
  try {
    const { hasCategories, hasHairstyles } = await checkDataExists();
    
    if (!hasCategories || !hasHairstyles) {
      console.log('Database appears empty, seeding sample data...');
      await seedAllData();
      return true;
    }
    
    console.log('Database already has data, skipping seeding.');
    return false;
  } catch (error) {
    console.error('Error in auto-seeding:', error);
    return false;
  }
}; 