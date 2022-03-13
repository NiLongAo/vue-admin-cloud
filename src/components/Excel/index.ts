import { withInstall } from '/@/utils';
import impExcel from './src/ImportExcel.vue';
import expExcelModal from './src/ExportExcelModal.vue';
import expExportCommonModel from './src/ExportCommonModel.vue';

export const ImpExcel = withInstall(impExcel);
export const ExpExcelModal = withInstall(expExcelModal);
export const ExportCommonModel = withInstall(expExportCommonModel);
export * from './src/typing';
export { jsonToSheetXlsx, aoaToSheetXlsx } from './src/Export2Excel';
