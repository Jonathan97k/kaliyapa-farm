const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_TEXT_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_ROLE_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_FEATURES_COUNT = 10;
const MAX_FEATURE_LENGTH = 500;
const MAX_IMAGES_COUNT = 15;

const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
const DATA_URL_REGEX = /^data:(image|video)\/[a-zA-Z]+;base64,/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (DATA_URL_REGEX.test(url)) return true;
  if (URL_REGEX.test(url)) return true;
  return false;
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

export function validateRequiredString(
  value: unknown,
  fieldName: string,
  maxLength: number
): string {
  if (!value || typeof value !== 'string') {
    throw new Error(`${fieldName} is required and must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  if ((DATA_URL_REGEX.test(trimmed) || URL_REGEX.test(trimmed)) && maxLength < 10000) return trimmed;
  if (trimmed.length > maxLength) {
    throw new Error(`${fieldName} must be less than ${maxLength} characters`);
  }
  return trimmed;
}

export function validateServiceInput(body: unknown): {
  title: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
} {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const b = body as Record<string, unknown>;

  const title = validateRequiredString(b.title, 'Title', MAX_TITLE_LENGTH);
  const description = validateRequiredString(b.description, 'Description', MAX_DESCRIPTION_LENGTH);
  const image = validateRequiredString(b.image, 'Image URL', 2048);

  if (!isValidUrl(image)) {
    throw new Error('Invalid cover image URL format');
  }

  let images: string[] = [image];
  if (b.images) {
    if (!Array.isArray(b.images)) {
      throw new Error('Images must be an array');
    }
    if (b.images.length > MAX_IMAGES_COUNT) {
      throw new Error(`Images cannot exceed ${MAX_IMAGES_COUNT} items`);
    }
    images = b.images.map((img, i) => {
      const url = validateRequiredString(img, `Image ${i + 1}`, 2048);
      if (!isValidUrl(url)) {
        throw new Error(`Invalid URL format for image ${i + 1}`);
      }
      return url;
    });
    if (!images.includes(image)) {
      images.unshift(image);
    }
  }

  let features: string[] = [];
  if (b.features) {
    if (!Array.isArray(b.features)) {
      throw new Error('Features must be an array');
    }
    if (b.features.length > MAX_FEATURES_COUNT) {
      throw new Error(`Features cannot exceed ${MAX_FEATURES_COUNT} items`);
    }
    features = b.features.map((f, i) => validateRequiredString(f, `Feature ${i + 1}`, MAX_FEATURE_LENGTH));
  }

  return { title, description, image, images, features };
}

export function validateGalleryInput(body: unknown): {
  url: string;
  category: string;
  title: string;
} {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const b = body as Record<string, unknown>;

  const url = validateRequiredString(b.url, 'Image URL', 2048);
  if (!isValidUrl(url)) {
    throw new Error('Invalid image URL format');
  }

  const category = validateRequiredString(b.category, 'Category', MAX_TITLE_LENGTH);
  const title = validateRequiredString(b.title, 'Title', MAX_TITLE_LENGTH);

  return { url, category, title };
}

export function validateTestimonialInput(body: unknown): {
  name: string;
  role: string;
  text: string;
  image?: string;
} {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const b = body as Record<string, unknown>;

  const name = validateRequiredString(b.name, 'Name', MAX_NAME_LENGTH);
  const role = validateRequiredString(b.role, 'Role', MAX_ROLE_LENGTH);
  const text = validateRequiredString(b.text, 'Text', MAX_TEXT_LENGTH);

  let image: string | undefined;
  if (b.image) {
    image = validateRequiredString(b.image, 'Image URL', 2048);
    if (!isValidUrl(image)) {
      throw new Error('Invalid image URL format');
    }
  }

  return { name, role, text, image };
}

export function validateInquiryInput(body: unknown): {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
} {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const b = body as Record<string, unknown>;

  const name = validateRequiredString(b.name, 'Name', MAX_NAME_LENGTH);
  const email = validateRequiredString(b.email, 'Email', MAX_EMAIL_LENGTH);

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  const phone = typeof b.phone === 'string' ? b.phone.trim().slice(0, MAX_PHONE_LENGTH) : '';
  const interest = validateRequiredString(b.interest, 'Interest', MAX_TITLE_LENGTH);
  const message = validateRequiredString(b.message, 'Message', MAX_MESSAGE_LENGTH);

  return { name, email, phone, interest, message };
}

export function validateLoginInput(body: unknown): { email: string; password: string } {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const b = body as Record<string, unknown>;

  const email = validateRequiredString(b.email, 'Email', MAX_EMAIL_LENGTH);
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  const password = validateRequiredString(b.password, 'Password', 128);

  return { email, password };
}
