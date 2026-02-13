export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
  isPreOrder?: boolean;
}

export const products: Product[] = [
    {
      id: 1,
      name: '23 ШИРХЭГ ХӨХӨВТӨР САРНАЙ "ӨВЛИЙН НАРНЫ ДУЛААН"',
      price: 11050,
      image: 'https://images.unsplash.com/photo-1656056970279-0cdd04b60434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9ueSUyMGJvdXF1ZXQlMjBwaW5rfGVufDF8fHx8MTc2OTUzMjg0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Сарнай'
    },
    {
      id: 2,
      name: 'ИРКУТСК ХОТОД УЛААН САРНАЙН БУКЕТ',
      price: 20750,
      image: 'https://images.unsplash.com/photo-1669869608865-84bb10423f99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjByb3NlcyUyMHJvbWFudGljJTIwYm91cXVldHxlbnwxfHx8fDE3Njk1MzI3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      discount: 15,
      category: 'Сарнай'
    },
    {
      id: 3,
      name: 'ЦАГААН ГОРТЕНЗЫН 25 ШИРХЭГ БУКЕТ',
      price: 2750,
      image: 'https://images.unsplash.com/photo-1629379555555-79c361b3736b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyYW5nZWElMjBibHVlJTIwZmxvd2Vyc3xlbnwxfHx8fDE3Njk0OTY4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Гортенз'
    },
    {
      id: 4,
      name: 'АЛТАН ӨНГӨТӨЙ ХРИЗАНТЕМИЙН БУКЕТ',
      price: 5800,
      image: 'https://images.unsplash.com/photo-1701140731153-5f7ab1a0b198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBjaHJ5c2FudGhlbXVtJTIwYm91cXVldHxlbnwxfHx8fDE3Njk1MzI4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      isPreOrder: true,
      category: 'Хризантема'
    },
    {
      id: 5,
      name: 'ЯМ ЯГААН АЛТАНЗУЛ ХАВДРЫН БУКЕТ',
      price: 135650,
      image: 'https://images.unsplash.com/photo-1712688922191-b83ecaa59b88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjB0dWxpcHMlMjBzcHJpbmd8ZW58MXx8fHwxNzY5NTMyODUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Алтанзул'
    },
    {
      id: 6,
      name: 'ЦАГААН САРАНЦАЦАГИЙН БУКЕТ',
      price: 8900,
      image: 'https://images.unsplash.com/photo-1687946271298-caa66056eef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxpbHklMjBlbGVnYW50fGVufDF8fHx8MTc2OTQ4OTI1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Сараана'
    },
    {
      id: 7,
      name: 'ӨНГӨ ӨНГИЙН ЦЭЦГИЙН БУКЕТ',
      price: 12500,
      image: 'https://images.unsplash.com/photo-1679678109868-cb5bd66d61dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhlZCUyMGZsb3dlciUyMGJvdXF1ZXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3Njk0ODY1MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      discount: 10,
      category: 'Холимог'
    },
    {
      id: 8,
      name: 'ХӨХӨВТӨР САРНАЙН ЛЮКС БУКЕТ',
      price: 18900,
      image: 'https://images.unsplash.com/photo-1765399301689-404d702a9b10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwcm9zZXMlMjBib3VxdWV0JTIwbHV4dXJ5fGVufDF8fHx8MTc2OTUzMjc0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Сарнай'
    },
    {
      id: 9,
      name: 'ХАЙРЫН БЭЛЭГ БАГЦ',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwd2l0aCUyMGZsb3dlcnN8ZW58MXx8fHwxNzY5NTgzNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Бэлэг'
    },
    {
      id: 10,
      name: 'УЛААН САРНАЙ 101 ШИРХЭГ',
      price: 250000,
      image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwxMDElMjByZWQlMjByb3Nlc3xlbnwxfHx8fDE3Njk1ODM3NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Сарнай',
      isPreOrder: true
    },
    {
      id: 11,
      name: 'ЦАГААН ЛИЛИ',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1588713028254-8c886616091e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxpbGllc3xlbnwxfHx8fDE3Njk1ODM3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Сараана'
    },
    {
      id: 12,
      name: 'ХӨГЖИЛТЭЙ ГЭР БҮЛ БАГЛАА',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1563241527-300527fd9665?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlcmZ1bCUyMGZsb3dlciUyMGJvdXF1ZXR8ZW58MXx8fHwxNzY5NTgzODA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Холимог'
    }
  ];