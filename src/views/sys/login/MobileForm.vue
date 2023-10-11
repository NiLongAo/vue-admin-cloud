<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="phone" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phone"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="verificationCode" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.verificationCode"
          :count="count"
          :sendCodeApi="SmsSend"
          :placeholder="t('sys.login.smsCode')"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref, toRaw } from 'vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { doSmsSendSave, SmsType } from '/@/api/sys/sms';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { isPhone } from '/@/utils/validate';

  const { notification, createErrorModal, createMessage } = useMessage();
  const userStore = useUserStore();
  const FormItem = Form.Item;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const { prefixCls } = useDesign('login');
  const formRef = ref();
  const loading = ref(false);
  const count = ref(300);

  const formData = reactive({
    phone: '',
    verificationCode: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);

  const SmsSend = async () => {
    if (!isPhone(formData.phone)) {
      createMessage.error('手机号格式错误');
      return;
    }
    const data = await doSmsSendSave({
      type: SmsType.LOGIN_VERIFICATION_CODE,
      mobile: formData.phone,
    });
    if (!!data && !!data.expire) {
      count.value = data.expire;
    }
    return true;
  };

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login(
        toRaw({
          grantType: 'sms',
          sms: {
            phone: data.phone,
            smsCodeCode: data.verificationCode,
          },
          mode: 'none', //不要默认的错误提示
        }),
      );
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.userName}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: error.message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
