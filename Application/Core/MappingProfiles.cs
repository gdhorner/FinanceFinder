using Domain;
using AutoMapper;

namespace Application.Core
{
    public class MappingTransactions : Profile
    {
        public MappingTransactions()
        {
            CreateMap<Transaction, Transaction>();
        }

    }
}