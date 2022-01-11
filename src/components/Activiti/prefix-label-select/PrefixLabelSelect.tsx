import { Select } from 'ant-design-vue';
import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
import { debounce } from 'lodash-es';
import { defineComponent, PropType, computed,reactive,unref} from 'vue';
import { propTypes } from '/@/utils/propTypes';
import './prefix-label-select.css';
import { integer } from 'vue-types';

const PrefixLabelSelect = defineComponent({
  props: {
    ...Select.props,
    ...ApiSelect.props,
    searchName: propTypes.string.def('name'),
    isApi:propTypes.bool.def(false),
    //true: String,false:Number
    isValueType:propTypes.bool.def(false),
    prefixTitle: propTypes.string.def(''),
  },
  emits: ['update:value'],
  setup(props, { emit, slots }) {
    const computedModelValue = computed({
      get: () => (props.isValueType && !Number.isNaN(Number.parseInt(props.value))) ? Number(props.value): props.value ,
      set: (val) => emit('update:value', val),
    });
    const stats = reactive({
      keyword:props.value,
      choose: true,
      isblur: false,
      select: {}
    });
    const searchParams = computed<Recordable>(() => {
      const searchName = {...props.params};
      searchName[props.searchName] = unref(stats.keyword);
      return searchName;
    });

    const onBlur = ()=>{
      if (stats.keyword && !stats.choose) {
        computedModelValue.value= stats.keyword
      }
      stats.isblur = true
    }
    const onSearch = debounce((value)=>{
      if (stats.choose || stats.isblur) {
        stats.keyword= ''
      }
      stats.choose = false
      stats.isblur = false
      stats.keyword= value
    }, 300)

    const onSelect = debounce(value=>{
      stats.choose = true
      computedModelValue.value = value
    })

    if(props.showSearch){
      stats.select =  {
        params:searchParams,
        onBlur,
        onSearch,
        onSelect
      }          
    }else{
      stats.select = {}
    }
    if(props.isApi){
      return () => (
        <div class="prefix-label-select-container">
          {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}
          <ApiSelect
            class="prefix-label-select"
            {...props}
            {...stats.select}
            optionFilterProp="label"
            v-model:value={computedModelValue.value}
            v-slots={slots}
          />
        </div>
      );
    }else{
      return () => (
        <div class="prefix-label-select-container">
          {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}
          <Select
            class="prefix-label-select"
            {...props}
            {...stats.select}
            v-model:value={computedModelValue.value}
            v-slots={slots}
          />
        </div>
      );
    }
  },
});

export default PrefixLabelSelect;
