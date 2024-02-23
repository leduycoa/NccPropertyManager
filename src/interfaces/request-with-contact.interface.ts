import { Request } from 'express';
import { Contact } from '@prisma/client';

interface RequestWithContact extends Request {
  contact: Contact;
}

export default RequestWithContact;
