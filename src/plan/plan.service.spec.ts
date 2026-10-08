import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plan.service';
import { PrismaService } from 'src/database/prisma.service';

describe('PlanService', () => {
  let service: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlansService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
