import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SampleResults } from '../SampleResults';

describe('SampleResults', () => {
  it('renders sample countries', () => {
    render(<SampleResults />);

    expect(screen.getByText(/Sample destinations/i)).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('Thailand')).toBeInTheDocument();
  });

  it('displays encouragement message', () => {
    render(<SampleResults />);

    expect(screen.getByText(/Fill out your preferences/i)).toBeInTheDocument();
  });

  it('shows placeholder costs', () => {
    render(<SampleResults />);

    expect(screen.getAllByText('$800').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$2,200').length).toBeGreaterThan(0);
  });
});
