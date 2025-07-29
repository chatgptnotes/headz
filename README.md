# Headz Virtual Hair Fixing Try-On Web App

A modern web application for virtual hair try-on using AI technology, built with React.js frontend and Django REST backend.

## Features

- 📸 Virtual hair try-on using photo upload or camera capture
- 🎨 Browse and select from various hairstyles with **real professional images from Unsplash**
- 💾 Save favorite hairstyles
- 📅 Book appointments with hair fixing experts
- 👤 User profiles and authentication
- 🎯 AI-powered facial detection and hair overlay

## Real Hairstyle Images

The app now features **9 professional hairstyle options** with real images from Unsplash:

1. **Long Wavy Hair** - Beautiful wavy texture
2. **Bob Cut** - Classic short bob style  
3. **Pixie Cut** - Modern short pixie
4. **Beach Waves** - Natural beachy waves
5. **Straight Hair** - Sleek straight style
6. **Curly Hair** - Gorgeous curly texture
7. **Updo Style** - Elegant formal updo
8. **Braided Hair** - Intricate braided style
9. **Layered Cut** - Modern layered haircut

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- TensorFlow.js and MediaPipe for facial detection
- Axios for API calls

### Backend
- Django REST Framework
- SQLite database (development)
- JWT Authentication
- AWS S3/Cloudinary for image storage (production)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Start development server:
```bash
python manage.py runserver
```

The backend will run on http://localhost:8000

## API Endpoints

- `/api/users/` - User management
- `/api/profiles/` - User profiles
- `/api/categories/` - Hairstyle categories
- `/api/hairstyles/` - Hairstyle gallery
- `/api/tryon-sessions/` - Virtual try-on sessions
- `/api/saved-hairstyles/` - Saved hairstyles
- `/api/appointments/` - Appointment booking

## Project Structure

```
headz-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── public/
├── backend/
│   ├── headz_backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── media/
└── README.md
```

## Recent Updates

### ✨ Real Hairstyle Images Integration
- Replaced placeholder images with professional Unsplash photos
- Enhanced visual appeal and user experience
- 3x3 grid layout for better organization
- Optimized images with face cropping (200x200px)

## Next Steps

1. Integrate AI hair overlay SDK (Banuba, Perfect Corp, etc.)
2. Implement JWT authentication
3. Add payment integration for appointments
4. Deploy to production (Vercel/Netlify for frontend, AWS/Heroku for backend)
5. Add real-time features with WebSockets

## License

This project is proprietary and confidential.
