import { Test, TestingModule } from '@nestjs/testing';
import { PdfReportController } from './pdf-report.controller';
import { PdfReportService } from './pdf-report.service';

describe('PdfReportController', () => {
  let controller: PdfReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfReportController],
      providers: [PdfReportService],
    }).compile();

    controller = module.get<PdfReportController>(PdfReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
