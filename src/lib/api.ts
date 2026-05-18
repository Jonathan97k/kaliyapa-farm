export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  category: string;
  title: string;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  image?: string;
  created_at?: string;
}

export interface AuthResponse {
  email: string;
}

const API_BASE = typeof window !== 'undefined' ? '/api' : 'http://localhost:3001/api';

function getHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    headers['credentials'] = 'include' as any;
  }
  return headers;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Login failed');
  }

  const data = await response.json();
  return data;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split('; ')
    .some((row) => row.startsWith('admin_email='));
}

export function getAdminEmail(): string | null {
  if (typeof document === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('admin_email='))
    ?.split('=')[1] || null;
}

export async function fetchServices(): Promise<Service[]> {
  const response = await fetch(`${API_BASE}/services`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  return response.json();
}

export async function createService(
  service: Omit<Service, 'id' | 'created_at' | 'updated_at'>
): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(service),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to create service');
  }

  return response.json();
}

export async function updateService(
  service: Partial<Service> & { id: string }
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/services`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(service),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update service');
  }

  return response.json();
}

export async function deleteService(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/services?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders(true),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete service');
  }

  return response.json();
}

export async function submitInquiry(inquiry: {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(inquiry),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to submit inquiry');
  }

  return response.json();
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const response = await fetch(`${API_BASE}/inquiries`, {
    headers: getHeaders(true),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch inquiries');
  }

  return response.json();
}

export async function deleteInquiry(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/inquiries?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders(true),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete inquiry');
  }

  return response.json();
}

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const response = await fetch(`${API_BASE}/gallery`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch gallery images');
  }

  return response.json();
}

export async function createGalleryImage(
  image: Omit<GalleryImage, 'id' | 'created_at'>
): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE}/gallery`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(image),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to add image');
  }

  return response.json();
}

export async function updateGalleryImage(
  image: Partial<GalleryImage> & { id: string }
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/gallery`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(image),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update image');
  }

  return response.json();
}

export async function deleteGalleryImage(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/gallery?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders(true),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete image');
  }

  return response.json();
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const response = await fetch(`${API_BASE}/testimonials`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch testimonials');
  }

  return response.json();
}

export async function createTestimonial(
  testimonial: Omit<Testimonial, 'id' | 'created_at'>
): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE}/testimonials`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(testimonial),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to add testimonial');
  }

  return response.json();
}

export async function updateTestimonial(
  testimonial: Partial<Testimonial> & { id: string }
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/testimonials`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(testimonial),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update testimonial');
  }

  return response.json();
}

export interface Subscriber {
  id: string;
  email: string;
  created_at?: string;
}

export async function subscribe(email: string): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE}/subscribers`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || 'Failed to subscribe');
    } catch {
      if (response.status >= 500) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      throw new Error(text || 'Failed to subscribe');
    }
  }

  return response.json();
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  const response = await fetch(`${API_BASE}/subscribers`, {
    headers: getHeaders(true),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subscribers');
  }

  return response.json();
}

export async function deleteSubscriber(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/subscribers?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders(true),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete subscriber');
  }

  return response.json();
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/testimonials?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders(true),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete testimonial');
  }

  return response.json();
}
