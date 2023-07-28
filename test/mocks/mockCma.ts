import { vi } from 'vitest';

const mockCma: any = {
  contentType: {
    getMany: vi.fn().mockResolvedValue({
      items: [
        {
          sys: {
            id: 'mockId',
          },
          fields: {
            title: 'mockTitle',
            slug: 'mockSlug',
            description: 'mockDescription',
            image: {
              sys: {
                id: 'mockImageId',
              },
            },
            body: 'mockBody',
          },
        },
      ],
    }),
  }
};

export { mockCma };
