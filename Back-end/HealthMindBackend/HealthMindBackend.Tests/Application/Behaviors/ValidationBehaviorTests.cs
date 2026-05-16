using FluentAssertions;
using FluentValidation;
using HealthMindBackend.Application.Behaviors;
using MediatR;

namespace HealthMindBackend.Tests.Application.Behaviors
{
    public class ValidationBehaviorTests
    {
        [Fact]
        public async Task Handle_WhenThereAreNoValidators_ShouldCallNextAndReturnResponse()
        {
            // Arrange
            var behavior = new ValidationBehavior<FakeCommand, FakeResponse>(
                Enumerable.Empty<IValidator<FakeCommand>>());

            var expectedResponse = new FakeResponse("ok");
            var nextCalled = false;

            RequestHandlerDelegate<FakeResponse> next = _ =>
            {
                nextCalled = true;
                return Task.FromResult(expectedResponse);
            };

            // Act
            var response = await behavior.Handle(
                new FakeCommand("Raphael"),
                next,
                CancellationToken.None);

            // Assert
            response.Should().BeSameAs(expectedResponse);
            nextCalled.Should().BeTrue();
        }

        [Fact]
        public async Task Handle_WhenValidationPasses_ShouldCallNextAndReturnResponse()
        {
            // Arrange
            var validators = new IValidator<FakeCommand>[] { new FakeCommandValidator() };
            var behavior = new ValidationBehavior<FakeCommand, FakeResponse>(validators);

            var expectedResponse = new FakeResponse("created");
            var nextCalled = false;

            RequestHandlerDelegate<FakeResponse> next = _ =>
            {
                nextCalled = true;
                return Task.FromResult(expectedResponse);
            };

            // Act
            var response = await behavior.Handle(
                new FakeCommand("Raphael"),
                next,
                CancellationToken.None);

            // Assert
            response.Should().BeSameAs(expectedResponse);
            nextCalled.Should().BeTrue();
        }

        [Fact]
        public async Task Handle_WhenValidationFails_ShouldThrowValidationExceptionAndNotCallNext()
        {
            // Arrange
            var validators = new IValidator<FakeCommand>[] { new FakeCommandValidator() };
            var behavior = new ValidationBehavior<FakeCommand, FakeResponse>(validators);

            var nextCalled = false;

            RequestHandlerDelegate<FakeResponse> next = _ =>
            {
                nextCalled = true;
                return Task.FromResult(new FakeResponse("should-not-execute"));
            };

            // Act
            Func<Task> act = async () => await behavior.Handle(
                new FakeCommand(string.Empty),
                next,
                CancellationToken.None);

            // Assert
            var exception = await act.Should().ThrowAsync<ValidationException>();
            exception.Which.Errors.Should().ContainSingle(error =>
                error.PropertyName == "Name" &&
                error.ErrorMessage == "Nome é obrigatório");
            nextCalled.Should().BeFalse();
        }

        private sealed record FakeCommand(string Name) : IRequest<FakeResponse>;
        private sealed record FakeResponse(string Message);

        private sealed class FakeCommandValidator : AbstractValidator<FakeCommand>
        {
            public FakeCommandValidator()
            {
                RuleFor(command => command.Name)
                    .NotEmpty()
                    .WithMessage("Nome é obrigatório");
            }
        }
    }
}
