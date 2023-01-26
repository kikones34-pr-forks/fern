# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import datetime as dt
import typing

import pydantic
import typing_extensions

T_Result = typing.TypeVar("T_Result")


class _Factory:
    def and_(self, value: bool) -> Test:
        return Test(__root__=_Test.And(type="and", value=value))

    def or_(self, value: bool) -> Test:
        return Test(__root__=_Test.Or(type="or", value=value))


class Test(pydantic.BaseModel):
    factory: typing.ClassVar[_Factory] = _Factory()

    def get_as_union(self) -> typing.Union[_Test.And, _Test.Or]:
        return self.__root__

    def visit(self, and_: typing.Callable[[bool], T_Result], or_: typing.Callable[[bool], T_Result]) -> T_Result:
        if self.__root__.type == "and":
            return and_(self.__root__.value)
        if self.__root__.type == "or":
            return or_(self.__root__.value)

    __root__: typing_extensions.Annotated[typing.Union[_Test.And, _Test.Or], pydantic.Field(discriminator="type")]

    class Validators:
        """
        Use this class to add validators to the Pydantic model.

            @Test.Validators.validate
            def validate(value: typing.Union[_Test.And, _Test.Or]) -> typing.Union[_Test.And, _Test.Or]:
                ...
        """

        _validators: typing.ClassVar[
            typing.List[typing.Callable[[typing.Union[_Test.And, _Test.Or]], typing.Union[_Test.And, _Test.Or]]]
        ] = []

        @classmethod
        def validate(
            cls, validator: typing.Callable[[typing.Union[_Test.And, _Test.Or]], typing.Union[_Test.And, _Test.Or]]
        ) -> None:
            cls._validators.append(validator)

    @pydantic.root_validator(pre=False)
    def _validate(cls, values: typing.Dict[str, typing.Any]) -> typing.Dict[str, typing.Any]:
        value = typing.cast(typing.Union[_Test.And, _Test.Or], values.get("__root__"))
        for validator in Test.Validators._validators:
            value = validator(value)
        return {**values, "__root__": value}

    def json(self, **kwargs: typing.Any) -> str:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().json(**kwargs_with_defaults)

    def dict(self, **kwargs: typing.Any) -> typing.Dict[str, typing.Any]:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().dict(**kwargs_with_defaults)

    class Config:
        frozen = True
        json_encoders = {dt.datetime: lambda v: v.isoformat()}


class _Test:
    class And(pydantic.BaseModel):
        type: typing_extensions.Literal["and"]
        value: bool

        class Config:
            frozen = True
            json_encoders = {dt.datetime: lambda v: v.isoformat()}

    class Or(pydantic.BaseModel):
        type: typing_extensions.Literal["or"]
        value: bool

        class Config:
            frozen = True
            json_encoders = {dt.datetime: lambda v: v.isoformat()}


Test.update_forward_refs()
