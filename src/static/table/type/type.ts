interface Props { /* ... */ }
interface Emit { /* ... */ }

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

interface Props {
    tableProps: any;
    columns: any[];
    tableData: any[];
  }