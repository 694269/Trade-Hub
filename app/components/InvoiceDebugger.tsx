'use client';

import { useEffect } from 'react';

export default function InvoiceDebugger({ data }: { data: any }) {
  useEffect(() => {
    console.log('%c📦 Invoice Data from Server:', 'color: limegreen; font-weight: bold;', data);
  }, [data]);

  return null; // Nothing rendered, just for debugging
}
