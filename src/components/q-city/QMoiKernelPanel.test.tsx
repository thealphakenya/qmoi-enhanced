import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QMoiKernelPanel from './QMoiKernelPanel';

// Mock the custom hook
jest.mock('../../hooks/useQmoiKernel', () => ({
  useQmoiKernel: () => ({
    status: {
      status: 'OK',
      lastCheck: '2024-06-01T12:00:00Z',
      mutationCount: 5,
      logs: ['Log 1', 'Log 2'],
    },
    loading: false,
    error: null,
    lastAction: { success: true, message: 'QFix done' },
    fetchStatus: jest.fn(),
    runAction: jest.fn(),
  }),
}));

describe('QMoiKernelPanel', () => {
  it('renders nothing if not master', () => {
    const { container } = render(<QMoiKernelPanel isMaster={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders status, last check, mutation count, and logs', () => {
    render(<QMoiKernelPanel isMaster={true} />);
    expect(screen.getByText(/QMOI Kernel Control Panel/)).toBeInTheDocument();
    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText(/Last Check:/)).toBeInTheDocument();
    expect(screen.getByText('2024-06-01T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText(/Mutation Count:/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Log 1')).toBeInTheDocument();
    expect(screen.getByText('Log 2')).toBeInTheDocument();
  });

  it('shows last action result', () => {
    render(<QMoiKernelPanel isMaster={true} />);
    expect(screen.getByText(/Last Action:/)).toBeInTheDocument();
    expect(screen.getByText('QFix done')).toBeInTheDocument();
  });

  it('shows action and refresh buttons', () => {
    render(<QMoiKernelPanel isMaster={true} />);
    expect(screen.getByRole('button', { name: /Run QFix/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run QOptimize/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run QSecure/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    jest.resetModules();
    jest.doMock('../../hooks/useQmoiKernel', () => ({
      useQmoiKernel: () => ({
        status: {
          status: 'OK',
          lastCheck: '2024-06-01T12:00:00Z',
          mutationCount: 5,
          logs: [],
        },
        loading: true,
        error: null,
        lastAction: null,
        fetchStatus: jest.fn(),
        runAction: jest.fn(),
      }),
    }));
    const QMoiKernelPanelReloaded = require('./QMoiKernelPanel').default;
    render(<QMoiKernelPanelReloaded isMaster={true} />);
    expect(screen.getByRole('button', { name: /Run QFix/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Run QOptimize/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Run QSecure/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeDisabled();
  });

  it('shows error message if error exists', () => {
    jest.resetModules();
    jest.doMock('../../hooks/useQmoiKernel', () => ({
      useQmoiKernel: () => ({
        status: {
          status: 'OK',
          lastCheck: '2024-06-01T12:00:00Z',
          mutationCount: 5,
          logs: [],
        },
        loading: false,
        error: 'Something went wrong',
        lastAction: null,
        fetchStatus: jest.fn(),
        runAction: jest.fn(),
      }),
    }));
    const QMoiKernelPanelReloaded = require('./QMoiKernelPanel').default;
    render(<QMoiKernelPanelReloaded isMaster={true} />);
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
}); 