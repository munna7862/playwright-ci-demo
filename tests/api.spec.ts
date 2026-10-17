import { test, expect } from '@playwright/test';

test('GET /booking/1 returns a booking', async ({ request }) => {
  const res = await request.get('/booking/1');
  expect(res.ok()).toBeTruthy();
  expect(await res.json()).toHaveProperty('firstname');
});

test('create a booking', async ({ request }) => {
  const res = await request.post('/booking', {
    data: {
      firstname: 'Asha', lastname: 'Rao', totalprice: 150, depositpaid: true,
      bookingdates: { checkin: '2026-11-03', checkout: '2026-11-05' },
    },
  });
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).booking.firstname).toBe('Asha');
});
