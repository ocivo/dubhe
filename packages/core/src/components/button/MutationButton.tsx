import { useMutation } from "react-query";
import { message } from "antd";
import { isFunction } from "lodash";
import { Button, ButtonProps } from "@chakra-ui/react";
import { useEffect } from "react";

export interface MutationButtonProps extends ButtonProps {
  request: any;
  params?: any;
  onSuccess: (data: any) => void;
  onError?: (e: any) => void;
}

export const MutationButton = (props: MutationButtonProps) => {
  const { request, params, onSuccess, onError, ...restProps } = props;

  console.log(".........")
  const { mutate, isLoading } = useMutation(request, {
    onSuccess(data) {
      onSuccess(data);
    },
    onError(e) {
      if (isFunction(onError)) {
        onError(e);
      } else {
        message.error(e as any);
      }
    },
  });
  return (
    <Button isLoading={isLoading} onClick={() => mutate(params)} {...restProps}>
      {props.children}
    </Button>
  );
};
