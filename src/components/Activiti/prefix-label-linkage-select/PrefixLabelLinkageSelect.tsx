import { Space,Select,Input } from 'ant-design-vue';
import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
import {doSelect as doUserSelect} from '/@/api/sys/user';
import {doSelect as doRoleSelect} from '/@/api/sys/role';
import {doSelect as doDepartmentSelect} from '/@/api/sys/department';
import { tenantObj } from '/@/settings/tenantSetting';
import { debounce } from 'lodash-es';
import { defineComponent, computed,reactive,unref,watch} from 'vue';
import { propTypes } from '/@/utils/propTypes';
import './prefix-label-linkage-select.css';
const PrefixLabelSelect = defineComponent({
  props: {
    ...Select.props,
    prefixTitle: propTypes.string.def(''),
  },
  emits: ['update:value'],
  setup(props, { emit, slots }) {
    const computedModelValue = computed({
      get: () =>  {
        if(!!props.value && props.value.startsWith("${assignments.resolve(execution,'")){
          let jsonStr = props.value.split("${assignments.resolve(execution,'")[1]
          jsonStr = jsonStr.split("')}")[0];
          let json = JSON.parse(jsonStr)[0];
          stats.selectValue=json.dimension;
          stats.apiSelectValue=json.values.map((obg) => Number(obg))
        }
        return props.value
      } ,
      set: (val) => {
        emit('update:value', val)
      },
    });

    const delSApi = (avl) =>{
      return{}
    }
    const stats = reactive({
      keyword:'',
      selectValue:'',
      apiSelectValue:[],
      searchApi:delSApi as Function,
      labelField:'name',
      valueField:'id',
    });

   

    watch(
      () => stats.selectValue,
      () => {
        stats.apiSelectValue= [];
        if(stats.selectValue == 'user'){
          stats.searchApi = doUserSelect;
        }else if(stats.selectValue == 'role'){
          stats.searchApi = doRoleSelect;
        }else if(stats.selectValue == 'dept'){
          stats.searchApi = doDepartmentSelect;
        }else{
          stats.searchApi = delSApi;
        }
      },
      { deep: true },
    );
    watch(
      () => stats.apiSelectValue,
      () => {
        if(stats.apiSelectValue.length > 0 ){
          let jsonString = "${assignments.resolve(execution,'JSON')}";
          let json = [{
            dimension:stats.selectValue,
            values:stats.apiSelectValue.map((obg) => String(obg))
          }]
          console.log(json);
          computedModelValue.value = jsonString.replace('JSON',JSON.stringify(json))
        }else{
          computedModelValue.value = '';
        }
      },
      { deep: true },
    );

    const searchParams = computed<Recordable>(() => {
      const searchName = {
        ...unref(tenantObj),
        idList:stats.apiSelectValue,
        name:stats.keyword,
        limit:20
      };
      return searchName;
    });
    const onSearch = debounce((value)=>{
      stats.keyword= value
    }, 300)
    return () => (
      <div class="prefix-label-linkage-select-container">
        {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}
        
          <Select
              class="w-1/2"
              options={[{value:'user',label:'用户'},{value:'role',label:'角色'},{value:'dept',label:'部门'}]}
              v-model:value={stats.selectValue}
              allowClear={true}
            />
          <ApiSelect
             class="w-1/2"
            {...props}
            mode="multiple"
            maxTagTextLength={4}
            maxTagCount={2}
            optionFilterProp="label"
            labelField={stats.labelField}
            api={stats.searchApi}
            params={unref(searchParams)}
            onSearch={onSearch}
            valueField={stats.valueField}
            v-model:value={stats.apiSelectValue}
            v-slots={slots}
          />
        
        <Input type='test' style={{display: 'none'}} v-model:value={computedModelValue.value}></Input>
      </div>
    );
    
  },
});

export default PrefixLabelSelect;
