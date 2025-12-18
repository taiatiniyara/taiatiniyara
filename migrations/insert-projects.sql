-- Insert Projects Data
-- Run this after creating the projects table

-- Generate slugs and insert projects
INSERT INTO projects (title, slug, description, content, demo_url, published, published_at, featured)
VALUES 
  (
    'Hakwa',
    'hakwa',
    'Hakwa is an ongoing project providing innovative solutions.',
    '<p>Hakwa is an ongoing project focused on delivering cutting-edge solutions.</p>',
    'https://hakwa.com',
    true,
    NOW(),
    true
  ),
  (
    'Totolaw',
    'totolaw',
    'Totolaw is an ongoing legal technology platform.',
    '<p>Totolaw is an ongoing initiative providing legal technology services and solutions.</p>',
    'https://totolaw.org',
    true,
    NOW(),
    true
  ),
  (
    'Pacific Power Association Performance Benchmarking',
    'pacific-power-association-performance-benchmarking',
    'A comprehensive performance benchmarking system for Pacific Power Association.',
    '<p>The Pacific Power Association Performance Benchmarking project is a completed initiative that provides detailed performance analytics and benchmarking capabilities for the Pacific Power Association.</p>',
    'http://prismdashboard.org/',
    true,
    NOW(),
    true
  ),
  (
    'Samoa Tourism Product Database',
    'samoa-tourism-product-database',
    'A comprehensive database system for Samoa Tourism products and services.',
    '<p>The Samoa Tourism Product Database is a completed project that manages and organizes tourism products and services across Samoa.</p>',
    'https://samoatourism-productdb.web.app/login',
    true,
    NOW(),
    true
  ),
  (
    'Niucut',
    'niucut',
    'Niucut is an ongoing project delivering modern web solutions.',
    '<p>Niucut is an ongoing project focused on providing modern web-based solutions and services.</p>',
    'https://niucut.com',
    true,
    NOW(),
    true
  );
