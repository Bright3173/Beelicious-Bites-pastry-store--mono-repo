'use client';

import api from '@/lib/api';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import {
  showErrorToast,
  showSuccessToast,
} from '@/components/toast-popup/Toastify';
import { useState } from 'react';

interface ProductFormValues {
  _id?: string;
  category: string;
  title: string;
  quantity: string;
  weight: string;
  oldPrice: string;
  newPrice: string;
  image?: string | null;
  imageTwo?: string | null;
  description: string;
}

type Props = {
  initialData?: ProductFormValues;
  isEdit?: boolean;
};

const validationSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  title: Yup.string().required('Title is required'),
  quantity: Yup.string()
    .required('Quantity is required')
    .matches(/^[0-9]+$/, 'Quantity must be a positive number'),
  weight: Yup.string().required('Weight is required'),
  oldPrice: Yup.string()
    .required('Old price is required')
    .matches(/^[0-9]+$/, 'Old price must be a positive number'),
  newPrice: Yup.string()
    .required('New price is required')
    .matches(/^[0-9]+$/, 'New price must be a positive number'),
  image: Yup.mixed().required('First image is required').nullable(),
  imageTwo: Yup.mixed().nullable(),
  description: Yup.string().nullable(),
});

export default function ProductForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string>(
    initialData?.image || ''
  );
  const [previewImageTwo, setPreviewImageTwo] = useState<string>(
    initialData?.imageTwo || ''
  );
  const initialValues: ProductFormValues = {
    category: initialData?.category || '',
    title: initialData?.title || '',
    quantity: initialData?.quantity || '0',
    weight: initialData?.weight || '',
    oldPrice: initialData?.oldPrice || '0',
    newPrice: initialData?.newPrice || '0',
    image: initialData?.image || null,
    imageTwo: initialData?.imageTwo || null,
    description: initialData?.description || '',
  };
  const handleSubmit = async (
    values: ProductFormValues,
    helpers: FormikHelpers<ProductFormValues>
  ) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showErrorToast('You must be logged in to create a product');
        return;
      }
      const formData = new FormData();
      formData.append('category', values.category);
      formData.append('title', values.title);
      formData.append('quantity', values.quantity.toString());
      formData.append('weight', values.weight);
      formData.append('oldPrice', values.oldPrice.toString());
      formData.append('newPrice', values.newPrice.toString());
      if (values.image) {
        formData.append('image', values.image);
      }
      if (values.imageTwo) {
        formData.append('imageTwo', values.imageTwo);
      }
      formData.append('description', values.description);

      if (isEdit && initialData?._id) {
        await api.put(`/products/${initialData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        showSuccessToast('Product updated successfully');
      } else {
        await api.post('/products', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        showSuccessToast('Product created successfully');
      }

      router.push('/admin/products');
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          `${isEdit ? 'Update' : 'Creation'} failed`
      );
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Create New Product</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.category}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="quantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="text"
                    name="quantity"
                    value={values.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.quantity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="weight">
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="text"
                    name="weight"
                    value={values.weight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.weight}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.weight}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="oldPrice">
                  <Form.Label>Old Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="oldPrice"
                    value={values.oldPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.oldPrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.oldPrice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="newPrice">
                  <Form.Label>New Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="newPrice"
                    value={values.newPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.newPrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newPrice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4" controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={(event) => {
                      const file =
                        (event.currentTarget as HTMLInputElement).files?.[0] ||
                        null;
                      setFieldValue('image', file);
                      if (file) {
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                    onBlur={handleBlur}
                    isInvalid={!!errors.image && touched.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image as string}
                  </Form.Control.Feedback>
                  {previewImage && (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      thumbnail
                      width={150}
                      height={150}
                      className="mt-3 rounded border"
                    />
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4" controlId="imageTwo">
                  <Form.Label>Second Image (optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="imageTwo"
                    onChange={(event) => {
                      const file =
                        (event.currentTarget as HTMLInputElement).files?.[0] ||
                        null;
                      setFieldValue('imageTwo', file);
                      if (file) {
                        setPreviewImageTwo(URL.createObjectURL(file));
                      }
                    }}
                    onBlur={handleBlur}
                    isInvalid={!!errors.imageTwo && touched.imageTwo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.imageTwo as string}
                  </Form.Control.Feedback>
                  {previewImageTwo && (
                    <Image
                      src={previewImageTwo}
                      alt="Preview"
                      thumbnail
                      width={150}
                      height={150}
                      className="mt-3 rounded border"
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4" controlId="description">
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.description && touched.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description as string}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? `${isEdit ? 'Updating' : 'Creating'}...`
                : `${isEdit ? 'Update' : 'Create'} Product`}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
