import { mockPost, mockGet, mockNavigate, mockIsAxiosError } from './mocks';
import { render, type RenderResult } from '@testing-library/react';
import authReducer from '../store/slices/authSlice/authSlice';
import { configureStore, type Store } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import React, { type ReactNode } from 'react';
import type { SubmitEvent } from 'react';
import { vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';

beforeEach(() => {
    mockPost.mockReset();
    mockGet.mockReset();
    mockNavigate.mockReset();
    mockIsAxiosError.mockReset();
});

export const createTestStore = (): Store => configureStore({ reducer: { auth: authReducer } });

export const createSubmitEvent = (): SubmitEvent<HTMLFormElement> =>
    ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

/**
 * Renders a component wrapped in Redux Provider and BrowserRouter.
 * Pass a store to reuse across the test; otherwise a fresh one is created.
 */
export const renderWithProviders = (
    ui: React.ReactElement,
    store: Store = createTestStore()
): RenderResult =>
    render(
        <Provider store={store}>
            <BrowserRouter>{ui}</BrowserRouter>
        </Provider>
    );

/**
 * Wrapper for renderHook from @testing-library/react.
 * Usage: renderHook(() => useLogin(), { wrapper: createHookWrapper(store) })
 */
export const createHookWrapper =
    (store: Store) =>
    ({ children }: { children: ReactNode }) => (
        <Provider store={store}>
            <BrowserRouter>{children}</BrowserRouter>
        </Provider>
    );
