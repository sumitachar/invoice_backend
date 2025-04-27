import { Test, TestingModule } from '@nestjs/testing';
import { GstController } from './gst.controller';

describe('GstController', () => {
  let controller: GstController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstController],
    }).compile();

    controller = module.get<GstController>(GstController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
