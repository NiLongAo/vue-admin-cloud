import { Space,Select,Input } from 'ant-design-vue';
import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
import {getChoiceUserPage} from '/@/api/sys/user';
import {getRolePage} from '/@/api/sys/role';
import {doPositionPage} from '/@/api/sys/position';
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
          stats.apiSelectValue=json.values;
        }
        return props.value
      } ,
      set: (val) => {
        emit('update:value', val)
      },
    });
    const stats = reactive({
      keyword:props.value,
      selectValue:'user',
      apiSelectValue:[],
      searchApi:getChoiceUserPage as Function,
      searchValues:'search',
      labelField:'userName',
      valueField:'userId',
      resultField:'data',
    });

    watch(
      () => stats.selectValue,
      () => {
        stats.apiSelectValue= [];
        if(stats.selectValue == 'user'){
          stats.searchApi = getChoiceUserPage;
          stats.labelField = 'userName';
          stats.valueField = 'userId';
        }else if(stats.selectValue == 'role'){
          stats.searchApi = getRolePage;
          stats.labelField = 'roleName';
          stats.valueField = 'id';
        }else if(stats.selectValue == 'dept'){
          stats.searchApi = doPositionPage;
          stats.labelField = 'positionName';
          stats.valueField = 'id';
        }
      },
      { deep: true },
    );
    watch(
      () => stats.apiSelectValue,
      () => {
        let jsonString = "${assignments.resolve(execution,'JSON')}";
        let json = [{
          dimension:stats.selectValue,
          values:stats.apiSelectValue
        }]
        computedModelValue.value = jsonString.replace('JSON',JSON.stringify(json))
      },
      { deep: true },
    );

    const searchParams = computed<Recordable>(() => {
      const searchName = {
        pageNumber:1,
        pageSize:1000
      };
      searchName[stats.searchValues] = unref(stats.keyword);
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
            mode="tags"
            maxTagTextLength={4}
            maxTagCount={2}
            optionFilterProp="label"
            labelField={stats.labelField}
            api={stats.searchApi}
            params={searchParams}
            onSearch={onSearch}
            valueField={stats.valueField}
            resultField={stats.resultField}
            v-model:value={stats.apiSelectValue}
            v-slots={slots}
          />
        
        <Input type='test' style={{display: 'none'}} v-model:value={computedModelValue.value}></Input>
      </div>
    );
    
  },
});

export default PrefixLabelSelect;
