// server/routes/testRoutes.js - TEMPORARY TEST ROUTE
// Test file upload endpoint
router.post('/test-upload', upload.single('testImage'), async (req, res) => {
  try {
    console.log('🧪 === FILE UPLOAD TEST ===');
    console.log('File received:', req.file ? 'YES' : 'NO');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }
    
    console.log('File details:', {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
    
    // Test Cloudinary upload
    const imageUrl = await uploadToCloudinary(req.file.buffer);
    
    res.json({
      success: true,
      message: 'File upload test successful!',
      originalName: req.file.originalname,
      cloudinaryUrl: imageUrl
    });
    
  } catch (error) {
    console.error('File upload test failed:', error);
    res.status(500).json({ error: error.message });
  }
});